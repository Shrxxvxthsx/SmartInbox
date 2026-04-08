from typing import List, Literal

from pydantic import BaseModel, Field, confloat

SentimentType = Literal["angry", "neutral", "happy"]
PriorityType = Literal["urgent", "normal", "spam"]
ActionType = Literal["reply", "escalate", "ignore"]


class SmartInboxObservation(BaseModel):
    """Observation returned by the SmartInbox environment."""

    email_text: str = Field(..., description="The full text of the incoming email.")
    sender: str = Field(..., description="The sender of the email.")
    sentiment: SentimentType = Field(..., description="Detected sentiment of the email.")
    priority: PriorityType = Field(..., description="Assigned email priority.")
    history: List[str] = Field(default_factory=list, description="Past interaction history for the email.")


class SmartInboxAction(BaseModel):
    """Action produced by an agent in the SmartInbox environment."""

    classification: PriorityType = Field(..., description="Predicted classification for the email.")
    response: str = Field(..., description="Text response or reply drafted by the agent.")
    action_type: ActionType = Field(..., description="Type of action selected for the email.")


class SmartInboxReward(BaseModel):
    """Reward returned by the SmartInbox environment."""

    score: confloat(ge=0.0, le=1.0) = Field(..., description="Reward score normalized between 0 and 1.")
