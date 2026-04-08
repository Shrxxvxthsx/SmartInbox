import copy
import random
from typing import Any, Dict, List, Optional, Tuple

from .grader import SmartInboxGrader
from .models import SmartInboxAction, SmartInboxObservation, SmartInboxReward
from .tasks import TASKS


class SmartInboxEnv:
    """OpenEnv-compatible RL environment for the SmartInbox task."""

    def __init__(self, task_config: Optional[Dict[str, Any]] = None):
        self.task_config = task_config or {}
        self.current_task: Optional[Dict[str, Any]] = None
        self.current_history: List[str] = []
        self.step_count: int = 0
        self.max_steps: int = 1
        self.grader: Optional[SmartInboxGrader] = None

    def reset(self) -> SmartInboxObservation:
        """Start a new episode by selecting a random email task."""
        self.current_task = copy.deepcopy(random.choice(TASKS))
        self.current_history = list(self.current_task.get("history", []))
        self.step_count = 0
        self.max_steps = random.randint(1, 3)
        self.grader = SmartInboxGrader(self.current_task)
        return self._build_observation()

    def step(self, action: SmartInboxAction) -> Tuple[SmartInboxObservation, float, bool, Dict[str, Any]]:
        """Apply the agent action, grade it, and return the new state."""
        if self.current_task is None or self.grader is None:
            raise RuntimeError("Environment must be reset before calling step().")

        if not isinstance(action, SmartInboxAction):
            action = SmartInboxAction(**action)

        self.step_count += 1
        self.current_history.append(
            f"Agent: {action.action_type} | {action.classification} | {action.response}"
        )
        self.current_history.append("System: Action processed")

        observation = self._build_observation()
        grade_result = self.grader.score(observation, action)
        reward_model = SmartInboxReward(score=grade_result["score"])
        reward = min(max(reward_model.score, 0.0), 1.0)

        done = self.step_count >= self.max_steps or reward > 0.9
        info = {
            "step": self.step_count,
            "max_steps": self.max_steps,
            "grading": grade_result.get("details", {}),
            "reward_model": reward_model.dict(),
        }

        return observation, reward, done, info

    def state(self) -> Dict[str, Any]:
        """Return the current internal task state."""
        return {
            "task": {
                "email_text": self.current_task["email_text"] if self.current_task else None,
                "sender": self.current_task["sender"] if self.current_task else None,
                "sentiment": self.current_task["sentiment"] if self.current_task else None,
                "priority": self.current_task["priority"] if self.current_task else None,
                "history": list(self.current_history),
            },
            "step_count": self.step_count,
            "max_steps": self.max_steps,
        }

    def _build_observation(self) -> SmartInboxObservation:
        assert self.current_task is not None, "No current task available. Call reset() first."
        return SmartInboxObservation(
            email_text=self.current_task["email_text"],
            sender=self.current_task["sender"],
            sentiment=self.current_task["sentiment"],
            priority=self.current_task["priority"],
            history=list(self.current_history),
        )
