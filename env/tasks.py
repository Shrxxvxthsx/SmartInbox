from typing import Any, Dict, List

TASKS: List[Dict[str, Any]] = [
    # Easy tasks
    {
        "email_text": "Hi, welcome to the team! Please review the attached employee handbook and let me know if you have any questions.",
        "sender": "hr@company.com",
        "sentiment": "happy",
        "priority": "normal",
        "history": [
            "Welcome email sent from HR.",
            "No prior replies in this thread.",
        ],
        "ground_truth": {
            "classification": "normal",
            "response_keywords": ["welcome", "thank you", "review attached"],
            "action": "reply",
        },
    },
    {
        "email_text": "Your password reset link has been requested. If you did not request this, please ignore this email.",
        "sender": "security@service.com",
        "sentiment": "neutral",
        "priority": "normal",
        "history": [
            "Password reset notification delivered.",
            "No previous conversation.",
        ],
        "ground_truth": {
            "classification": "normal",
            "response_keywords": ["ignore", "reset link", "security"],
            "action": "ignore",
        },
    },
    {
        "email_text": "Reminder: The weekly team check-in begins at 2 PM today in Conference Room B.",
        "sender": "teammate@company.com",
        "sentiment": "neutral",
        "priority": "normal",
        "history": [
            "Weekly meeting reminder sent.",
            "Attendance is expected.",
        ],
        "ground_truth": {
            "classification": "normal",
            "response_keywords": ["attend", "see you", "2 PM"],
            "action": "reply",
        },
    },
    {
        "email_text": "Huge discount on weight loss pills! Click now to save 90% on your order.",
        "sender": "offers@dealsales.com",
        "sentiment": "neutral",
        "priority": "spam",
        "history": [
            "Auto-filtered marketing spam message.",
            "No legitimate thread context.",
        ],
        "ground_truth": {
            "classification": "spam",
            "response_keywords": ["unsubscribe", "not interested", "spam"],
            "action": "ignore",
        },
    },
    {
        "email_text": "Your order #45830 has shipped and should arrive by Thursday. Track it here.",
        "sender": "orders@shoponline.com",
        "sentiment": "neutral",
        "priority": "normal",
        "history": [
            "Order confirmation already in thread.",
            "Shipment notification sent.",
        ],
        "ground_truth": {
            "classification": "normal",
            "response_keywords": ["thank you", "tracking", "received"],
            "action": "reply",
        },
    },

    # Medium tasks
    {
        "email_text": "Can you send me the Q1 marketing report by end of day? The VP wants to review it before tomorrow's meeting.",
        "sender": "manager@company.com",
        "sentiment": "neutral",
        "priority": "urgent",
        "history": [
            "Manager requested report.",
            "This is the first follow-up on the deliverable.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["send report", "today", "before meeting"],
            "action": "reply",
        },
    },
    {
        "email_text": "I'm very frustrated that my invoice still hasn't been corrected. Please fix this immediately or escalate to billing support.",
        "sender": "customer@client.com",
        "sentiment": "angry",
        "priority": "urgent",
        "history": [
            "Customer issue reported earlier.",
            "No satisfactory response yet.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["apologize", "billing support", "correct invoice"],
            "action": "escalate",
        },
    },
    {
        "email_text": "The vendor says the contract amendment is overdue and wants a final decision before Friday.",
        "sender": "partner@vendor.com",
        "sentiment": "neutral",
        "priority": "urgent",
        "history": [
            "Vendor follow-up on contract amendment.",
            "Decision deadline is approaching.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["review contract", "final decision", "Friday"],
            "action": "reply",
        },
    },
    {
        "email_text": "Security alert: suspicious login attempt detected on your account from an unknown device.",
        "sender": "alerts@security.com",
        "sentiment": "neutral",
        "priority": "urgent",
        "history": [
            "Automatic security notification.",
            "Action may be required to confirm account safety.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["confirm", "unverified device", "security"],
            "action": "reply",
        },
    },
    {
        "email_text": "Please confirm your availability for the client dinner next Tuesday and advise if you need any dietary accommodations.",
        "sender": "events@company.com",
        "sentiment": "happy",
        "priority": "normal",
        "history": [
            "Event invitation sent.",
            "Client-facing scheduling request.",
        ],
        "ground_truth": {
            "classification": "normal",
            "response_keywords": ["available", "dietary accommodations", "Tuesday"],
            "action": "reply",
        },
    },

    # Hard tasks
    {
        "email_text": "Our supplier is pushing back on the new pricing terms and says they need a signed amendment before next week. I need your assessment before I respond.",
        "sender": "procurement@company.com",
        "sentiment": "neutral",
        "priority": "urgent",
        "history": [
            "Procurement thread on supplier pricing.",
            "Negotiation stage with contract amendment.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["assess terms", "signed amendment", "next week"],
            "action": "reply",
        },
    },
    {
        "email_text": "The support ticket says the issue has been resolved, but I still can't access my account. If this is not fixed in an hour, escalate to Tier 2.",
        "sender": "enduser@client.com",
        "sentiment": "angry",
        "priority": "urgent",
        "history": [
            "Customer support ticket thread.",
            "Ticket marked resolved without a solution.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["escalate", "Tier 2", "access issue"],
            "action": "escalate",
        },
    },
    {
        "email_text": "Compliance reported that the quarterly audit folder is missing a signed NDA, and the legal team needs the original document attached before close of business.",
        "sender": "compliance@company.com",
        "sentiment": "neutral",
        "priority": "urgent",
        "history": [
            "Compliance audit follow-up.",
            "Document request with deadline.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["attach NDA", "legal team", "close of business"],
            "action": "reply",
        },
    },
    {
        "email_text": "The CEO wants a brief note summarizing the status of the product launch and any risks that still need attention. Please prepare it right away.",
        "sender": "executive@company.com",
        "sentiment": "neutral",
        "priority": "urgent",
        "history": [
            "Executive request for launch summary.",
            "Request is time-sensitive and high priority.",
        ],
        "ground_truth": {
            "classification": "urgent",
            "response_keywords": ["status summary", "risks", "prepare it right away"],
            "action": "reply",
        },
    },
    {
        "email_text": "This looks like a hidden phishing attempt, but the message claims to be from your bank and asks for urgent verification. Treat carefully and report if necessary.",
        "sender": "alerts@bank.com",
        "sentiment": "angry",
        "priority": "spam",
        "history": [
            "Potential phishing warning.",
            "Sender is suspicious and the request is unexpected.",
        ],
        "ground_truth": {
            "classification": "spam",
            "response_keywords": ["phishing", "do not reply", "report"],
            "action": "ignore",
        },
    },
]
