import os
import json
from openai import OpenAI
from dotenv import load_dotenv

def grade_coding_submission():
    """
    This function contains the core logic to get AI feedback for a hardcoded coding submission.

    """
    # Load environment variables from .env file
# 从 .env 文件加载环境变量
    load_dotenv()

    # --- 1. Manually Coded Mock Data ---

    
    user_id = "developer-01"
    task_id = "python-avg-func-v2"

    # The coding task description

    task_description = "Write a Python function named `calculate_average` that takes a list of numbers and returns their average. The function should handle empty lists gracefully by returning 0."
    
    # The grading rubric

    task_requirements = [
        "The function must be named `calculate_average`.",
        "It must correctly calculate the average of a list of positive numbers.",
        "It must handle lists containing zero and negative numbers correctly.",
        "It must return 0 if the input list is empty, without raising an error.",
        "The code must include a docstring explaining what the function does."
    ]

    # The user's flawed submission

    user_submission = """
def calculate_average(numbers):
    total = sum(numbers)
    return total / len(numbers)
"""

    # --- 2. Grading Prompt Design ---
    # --- 2. 评分提示设计 ---

    system_prompt = """
    You are an expert programming instructor. Your goal is to grade a student's code submission based on a given rubric and provide constructive, helpful feedback.

    You will evaluate the submission against each point in the task requirements. For each requirement, provide a score from 1 to 5 (1=Missing, 5=Excellent) and a brief justification.

    Also, provide one overall positive comment and one key suggestion for improvement. Calculate a final score out of 100.

    You MUST return your feedback in a structured JSON format. The JSON object must contain the following keys:
    - "userId": string
    - "taskId": string
    - "finalScore": integer (0-100)
    - "overallPositive": string
    - "overallSuggestion": string
    - "criteriaFeedback": an array of objects, where each object has:
        - "requirement": string
        - "score": integer (1-5)
        - "justification": string
    """

    # --- 3. Format the input for the AI ---
    # --- 3. 为 AI 格式化输入 ---
    
    user_content = f"""
    Please grade the following Python code submission based on the provided task description and requirements.

    --- TASK DESCRIPTION ---
    {task_description}

    --- TASK REQUIREMENTS ---
    {json.dumps(task_requirements, indent=2)}

    --- STUDENT'S SUBMISSION ---
    ```python
    {user_submission}
    ```
    """

    # --- 4. Call the OpenAI API ---

    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Error: OPENAI_API_KEY not found in environment variables.")
            return None

        client = OpenAI(api_key=api_key)
        
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"}
        )

        feedback_json = json.loads(resp.choices[0].message.content)
        return feedback_json

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# This block runs when the script is executed directly from the terminal

if __name__ == "__main__":
    print("--- Requesting feedback from AI... ---")
    
    feedback = grade_coding_submission()
    
    if feedback:
        print("\n--- AI Feedback Received ---")
        # Pretty-print the JSON to the terminal

        print(json.dumps(feedback, indent=4))
    else:
        print("\n--- Failed to get feedback. See error message above. ---")