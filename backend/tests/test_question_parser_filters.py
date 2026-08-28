import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from app.data_engine.question_parser import QuestionParser
from app.ai.qwen_model import get_qwen_model, unload_qwen_model


questions = [
    "Which product generated the highest revenue in Virginia?",

    "How many units were sold in Virginia?",

    "What was the total revenue in March?",

    "Which product generated the highest revenue through the Website?",

    "Which product generated the highest revenue in Virginia through the Website?",
]


qwen = get_qwen_model()

# Minimal schema to satisfy validate_against_schema
schema = {
    "source_columns": ["product", "location", "channel"],
    "semantic_mapping": {
        "product": "product",
        "location": "location",
        "channel": "channel",
    }
}

parser = QuestionParser(qwen=qwen, schema=schema)


print("=" * 70)
print("QWEN FILTER PARSER TEST")
print("=" * 70)


for index, question in enumerate(questions, 1):

    print("\n" + "=" * 70)
    print(f"QUESTION {index}")
    print("=" * 70)

    print(question)

    intent = parser.parse(question)

    print("\nSTRUCTURED INTENT")
    print("-" * 70)

    print(intent)

    assert "operation" in intent
    assert "entity" in intent
    assert "metric" in intent
    assert "limit" in intent
    assert "filters" in intent

    assert isinstance(
        intent["filters"],
        dict
    )


print("\n" + "=" * 70)
print("FILTER PARSER TEST COMPLETED")
print("=" * 70)

unload_qwen_model()
