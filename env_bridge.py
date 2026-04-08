#!/usr/bin/env python
"""
Bridge between Express.js server and Python SmartInbox environment.
Reads JSON commands from stdin and outputs results to stdout.
"""

import json
import sys
import os
from env.environment import SmartInboxEnv
from env.models import SmartInboxAction

# Global environment instance
env = SmartInboxEnv()

def handle_command(command: str, data: dict) -> dict:
    """Handle environment commands."""
    try:
        if command == "reset":
            observation = env.reset()
            return {
                "status": "success",
                "command": command,
                "observation": {
                    "email_text": observation.email_text,
                    "sender": observation.sender,
                    "sentiment": observation.sentiment,
                    "priority": observation.priority,
                    "history": observation.history,
                },
                "step_count": env.step_count,
                "max_steps": env.max_steps,
            }
        
        elif command == "step":
            action_data = data.get("action", {})
            try:
                action = SmartInboxAction(**action_data)
                observation, reward, done, info = env.step(action)
                
                return {
                    "status": "success",
                    "command": command,
                    "observation": {
                        "email_text": observation.email_text,
                        "sender": observation.sender,
                        "sentiment": observation.sentiment,
                        "priority": observation.priority,
                        "history": observation.history,
                    },
                    "reward": float(reward),
                    "done": done,
                    "info": info,
                    "step_count": env.step_count,
                }
            except Exception as e:
                return {
                    "status": "error",
                    "command": command,
                    "message": str(e),
                }
        
        elif command == "get_state":
            state = env.state()
            return {
                "status": "success",
                "command": command,
                "state": state,
            }
        
        else:
            return {
                "status": "error",
                "command": command,
                "message": f"Unknown command: {command}",
            }
    
    except Exception as e:
        return {
            "status": "error",
            "command": command,
            "message": str(e),
        }

def main():
    """Main entry point."""
    try:
        # Read command from stdin
        input_line = sys.stdin.readline()
        if not input_line:
            return
        
        request = json.loads(input_line)
        command = request.get("command")
        data = request.get("data", {})
        
        # Process command
        result = handle_command(command, data)
        
        # Output result
        print(json.dumps(result))
        sys.stdout.flush()
    
    except json.JSONDecodeError as e:
        print(json.dumps({
            "status": "error",
            "message": f"JSON parse error: {str(e)}"
        }))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e),
        }))

if __name__ == "__main__":
    main()
