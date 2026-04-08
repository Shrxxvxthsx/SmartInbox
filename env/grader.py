from typing import Any, Dict

from .models import SmartInboxObservation, SmartInboxAction


class SmartInboxGrader:
    """Grades agent performance on SmartInbox tasks."""

    def __init__(self, task_definition: Dict[str, Any]):
        self.task_definition = task_definition
        self.ground_truth = task_definition.get("ground_truth", {})

    def score(self, observation: SmartInboxObservation, action: SmartInboxAction) -> Dict[str, Any]:
        """Compute a deterministic score between 0.0 and 1.0."""
        score = 0.0
        details = {
            "classification_correct": False,
            "response_keyword_matches": 0,
            "response_keyword_score": 0.0,
            "action_correct": False,
            "penalty": 0.0,
        }

        expected_classification = self.ground_truth.get("classification")
        expected_keywords = self.ground_truth.get("response_keywords", [])
        expected_action = self.ground_truth.get("action")

        if expected_classification and action.classification == expected_classification:
            score += 0.3
            details["classification_correct"] = True

        response_text = action.response.lower()
        matches = sum(1 for keyword in expected_keywords if keyword.lower() in response_text)

        if expected_keywords:
            details["response_keyword_matches"] = matches
            details["response_keyword_score"] = min(matches / len(expected_keywords), 1.0) * 0.4
            score += details["response_keyword_score"]

        if expected_action and action.action_type == expected_action:
            score += 0.3
            details["action_correct"] = True

        if observation.priority == "spam" and action.action_type == "reply":
            score -= 1.0
            details["penalty"] -= 1.0

        if observation.priority == "urgent" and action.action_type == "ignore":
            score -= 0.5
            details["penalty"] -= 0.5

        final_score = max(0.0, min(1.0, score))
        return {"score": final_score, "details": details}
