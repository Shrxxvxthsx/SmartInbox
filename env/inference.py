import argparse
import json
import logging
import os
import sys
from typing import List, Optional

from openai import OpenAI, APIError, APIConnectionError, RateLimitError

from env.environment import SmartInboxEnv
from env.models import SmartInboxAction, SmartInboxObservation

# Configure logging with strict log format
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


class SmartInboxInference:
    """Inference runner for SmartInbox using OpenAI API."""

    def __init__(self):
        """Initialize OpenAI client with environment variables."""
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.api_base = os.getenv("API_BASE_URL")
        self.model_name = os.getenv("MODEL_NAME")

        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        if not self.model_name:
            raise ValueError("MODEL_NAME environment variable not set")

        # Initialize OpenAI client
        client_kwargs = {"api_key": self.api_key}
        if self.api_base:
            client_kwargs["base_url"] = self.api_base

        self.client = OpenAI(**client_kwargs)
        self.env = SmartInboxEnv()
        self.episode_history: List[dict] = []
        self.total_reward = 0.0
        self.step_count = 0

    def _build_prompt(self, observation: SmartInboxObservation, history_str: str) -> str:
        """Build the prompt for the LLM based on the current observation."""
        prompt = f"""You are an intelligent email management assistant. Analyze the incoming email and decide how to handle it.

Email Information:
- Sender: {observation.sender}
- Text: {observation.email_text}
- Sentiment: {observation.sentiment}
- Priority: {observation.priority}

Recent History:
{history_str}

Please respond with a JSON object containing exactly these fields:
{{
    "classification": "urgent|normal|spam",
    "action_type": "reply|escalate|ignore",
    "response": "Your response text here (be concise, 1-2 sentences)"
}}

Respond ONLY with valid JSON, no additional text."""
        return prompt

    def _parse_llm_response(self, response_text: str) -> Optional[dict]:
        """Parse the LLM response and extract action details."""
        try:
            response_text = response_text.strip()
            # Find JSON in the response
            start_idx = response_text.find("{")
            end_idx = response_text.rfind("}") + 1
            if start_idx == -1 or end_idx == 0:
                logger.warning("[STEP] Failed to find JSON in LLM response")
                return None

            json_str = response_text[start_idx:end_idx]
            data = json.loads(json_str)

            # Validate required fields
            if not all(
                key in data for key in ["classification", "action_type", "response"]
            ):
                logger.warning("[STEP] Missing required fields in LLM response")
                return None

            return data
        except json.JSONDecodeError as e:
            logger.warning(f"[STEP] JSON parse error: {e}")
            return None
        except Exception as e:
            logger.warning(f"[STEP] Unexpected error parsing response: {e}")
            return None

    def _call_llm(self, prompt: str) -> Optional[str]:
        """Call OpenAI API with error handling."""
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500,
            )
            return response.choices[0].message.content
        except RateLimitError as e:
            logger.error(f"[STEP] Rate limit exceeded: {e}")
            return None
        except APIConnectionError as e:
            logger.error(f"[STEP] API connection error: {e}")
            return None
        except APIError as e:
            logger.error(f"[STEP] API error: {e}")
            return None
        except Exception as e:
            logger.error(f"[STEP] Unexpected error calling API: {e}")
            return None

    def run_episode(self) -> dict:
        """Run a single episode of inference."""
        logger.info("[START] Beginning SmartInbox inference episode")
        self.episode_history = []
        self.total_reward = 0.0
        self.step_count = 0

        try:
            # Reset environment
            observation = self.env.reset()
            logger.info(
                f"[STEP] Environment reset. Max steps: {self.env.max_steps}"
            )

            # Main interaction loop
            done = False
            while not done:
                self.step_count += 1
                logger.info(f"[STEP] Step {self.step_count}/{self.env.max_steps}")

                # Build history string for context
                history_str = "\n".join(observation.history)
                if not history_str:
                    history_str = "No prior history"

                # Get LLM decision
                prompt = self._build_prompt(observation, history_str)
                llm_response = self._call_llm(prompt)

                if not llm_response:
                    logger.warning("[STEP] Failed to get LLM response, using default action")
                    action_data = {
                        "classification": "normal",
                        "action_type": "ignore",
                        "response": "Unable to process",
                    }
                else:
                    action_data = self._parse_llm_response(llm_response)
                    if not action_data:
                        logger.warning("[STEP] Failed to parse LLM response, using default action")
                        action_data = {
                            "classification": "normal",
                            "action_type": "ignore",
                            "response": "Parse error",
                        }

                # Create action
                try:
                    action = SmartInboxAction(**action_data)
                except Exception as e:
                    logger.error(f"[STEP] Error creating action: {e}")
                    action = SmartInboxAction(
                        classification="normal",
                        action_type="ignore",
                        response="Error",
                    )

                # Execute action in environment
                try:
                    observation, reward, done, info = self.env.step(action)
                    self.total_reward += reward
                    
                    # Log step details
                    logger.info(
                        f"[STEP] Action: {action.action_type} | "
                        f"Classification: {action.classification} | "
                        f"Reward: {reward:.2f} | Done: {done}"
                    )

                    # Store step in history
                    self.episode_history.append(
                        {
                            "step": self.step_count,
                            "action": action.dict(),
                            "reward": reward,
                            "done": done,
                            "info": info,
                        }
                    )

                except Exception as e:
                    logger.error(f"[STEP] Error during environment step: {e}")
                    done = True

            # Compute final score
            final_score = min(max(self.total_reward / self.step_count, 0.0), 1.0)
            
            logger.info("[END] Episode completed")
            logger.info(f"[END] Total steps: {self.step_count}")
            logger.info(f"[END] Total reward: {self.total_reward:.2f}")
            logger.info(f"[END] Average score: {final_score:.2f}")

            return {
                "success": True,
                "steps": self.step_count,
                "total_reward": self.total_reward,
                "final_score": final_score,
                "history": self.episode_history,
            }

        except Exception as e:
            logger.error(f"[END] Episode failed with error: {e}")
            return {
                "success": False,
                "error": str(e),
                "steps": self.step_count,
                "total_reward": self.total_reward,
                "final_score": 0.0,
                "history": self.episode_history,
            }

    def run_multiple_episodes(self, num_episodes: int = 1) -> dict:
        """Run multiple episodes and aggregate results."""
        logger.info(f"[START] Running {num_episodes} episode(s)")
        results = []
        total_scores = 0.0

        for episode in range(1, num_episodes + 1):
            logger.info(f"\n{'='*60}")
            logger.info(f"Episode {episode}/{num_episodes}")
            logger.info(f"{'='*60}\n")

            result = self.run_episode()
            results.append(result)
            if result.get("success"):
                total_scores += result.get("final_score", 0.0)

        avg_score = total_scores / num_episodes if num_episodes > 0 else 0.0
        logger.info(f"\n[END] Average score across {num_episodes} episodes: {avg_score:.2f}")

        return {
            "num_episodes": num_episodes,
            "average_score": avg_score,
            "episodes": results,
        }


def main():
    """Main entry point for inference."""
    parser = argparse.ArgumentParser(
        description="Run SmartInbox inference with OpenAI API"
    )
    parser.add_argument(
        "--episodes",
        type=int,
        default=1,
        help="Number of episodes to run (default: 1)",
    )
    args = parser.parse_args()

    try:
        inference = SmartInboxInference()
        results = inference.run_multiple_episodes(num_episodes=args.episodes)
        
        # Print final results
        logger.info("\n" + "="*60)
        logger.info("FINAL RESULTS")
        logger.info("="*60)
        logger.info(json.dumps(results, indent=2, default=str))
        
        return 0
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return 1
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
