"""
AI DATA ANALYZER - RESULT CONTEXT BUILDER

Packages the verified data result into a structured context object
that includes metadata and schema availability.
This object becomes the trusted context for Qwen to generate a final answer.
"""

from typing import Any, Dict
import os

class ResultContextBuilder:
    """
    Builds the trusted context object.
    """
    def __init__(self, schema: Dict[str, Any], dataset_path: str, row_count: int):
        self.schema = schema
        self.dataset_path = dataset_path
        self.row_count = row_count
        
    def build_context(self, question: str, result: Dict[str, Any], intent: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Builds the structured context object.
        """
        semantic_mapping = self.schema.get("semantic_mapping", {})
        
        # Build available context based on schema
        available_context = {
            "date": semantic_mapping.get("date") is not None,
            "location": semantic_mapping.get("location") is not None,
            "channel": semantic_mapping.get("channel") is not None,
            "customer": semantic_mapping.get("customer") is not None,
            "branch": semantic_mapping.get("branch") is not None,
            "category": semantic_mapping.get("category") is not None,
        }
        
        # Extract filename only
        filename = os.path.basename(self.dataset_path)
        
        context = {
            "question": question,
            "intent": intent,
            "result": result,
            "available_context": available_context,
            "source": {
                "file": filename,
                "rows_analyzed": self.row_count
            }
        }
        
        return context
