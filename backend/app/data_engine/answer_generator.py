"""
AI DATA ANALYZER - ANSWER GENERATOR

Uses Qwen2.5-7B-Instruct to generate a natural language answer based on the 
trusted structured context from the Context Builder.
It strictly adheres to verified facts without inventing data.
"""

from typing import Any, Dict
import json
from app.ai.qwen_model import QwenModel

class AnswerGenerator:
    """
    Generates natural language answers from verified data contexts.
    """
    
    MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct"
    
    def __init__(self, qwen: QwenModel):
        self.qwen = qwen

    def _build_prompt(self, context: Dict[str, Any]) -> str:
        prompt = f"""
You are the final answer generator for an AI data analyzer.
Your job is to read the verified data context and answer the user's question clearly and concisely.

RULES:
1. Never invent numbers or columns.
2. Only mention fields present in `result`.
3. Do not give an analysis plan or tell the user how to perform the analysis.
4. Answer the actual question directly in a single natural sentence or paragraph.
5. Use simple language.
6. Format numerical values appropriately (e.g. $2,537,181.00 or 1,286).
7. If the context indicates required fields were not available, state that explicitly.

The result was calculated by a deterministic database engine.

You MUST NOT:
- calculate numbers
- recompute revenue
- aggregate rows
- invent dimensions
- invent locations
- invent dates
- invent branches
- add missing information

Use ONLY values contained in the verified context.

If group_by contains multiple dimensions,
describe the result as combinations of those dimensions.

For example:

group_by:
["product", "location"]

means each result row represents a
product-location combination.

Do not create additional combinations
that are not present in the result.

TRUSTED DATA CONTEXT:
{json.dumps(context, indent=2)}

Please provide the final natural language answer to the question.
"""
        return prompt.strip()

    def generate(self, context: Dict[str, Any]) -> str:
        """
        Generate the natural language answer from the context.
        """
        prompt = self._build_prompt(context)
        
        response = self.qwen.generate(
            prompt,
            max_new_tokens=150,
            temperature=0.1,
        )
        
        return response

    def unload(self):
        pass  # Unloading is now managed by QwenModel manager
