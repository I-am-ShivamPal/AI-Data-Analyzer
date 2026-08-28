import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from app.ai.qwen_model import (
    get_qwen_model,
    unload_qwen_model,
)

from app.data_engine.question_parser import (
    QuestionParser,
    IntentValidationError,
)


QUESTIONS = [
    "Which product generated the highest revenue?",
    "Which product sold the most units?",
    "Which location generated the highest revenue?",
    "Which channel generated the highest revenue?",
    "Show revenue by product.",
    "Show revenue by location.",
    "Show revenue by channel.",
    "How many orders are there?",
    "How many customers are there?",
    "What is the total revenue?",
    "What is the total number of units sold?",
    "Give me an overview of the dataset.",
]


print("=" * 70)
print("HARDENED QWEN INTENT PARSER TEST")
print("=" * 70)

qwen = get_qwen_model()

# IMPORTANT:
# Replace this with your actual schema object.
schema = {
    "source_columns": [
        "productID",
        "product_name",
        "product_price",
        "number_of_ordered_items",
        "order_status",
        "customer_name",
        "location",
        "latitude",
        "longitude",
        "channel_of_ordering",
        "date",
    ],
    "semantic_mapping": {
        "product": "product_name",
        "product_id": "productID",
        "price": "product_price",
        "quantity": "number_of_ordered_items",
        "revenue": None,
        "date": "date",
        "location": "location",
        "latitude": "latitude",
        "longitude": "longitude",
        "branch": None,
        "customer": "customer_name",
        "status": "order_status",
        "channel": "channel_of_ordering",
        "category": None,
    },
}

parser = QuestionParser(
    qwen=qwen,
    schema=schema,
)

for index, question in enumerate(
    QUESTIONS,
    start=1,
):

    print("\n" + "=" * 70)
    print(f"QUESTION {index}")
    print("=" * 70)

    print(question)

    try:

        intent = parser.parse(question)

        print("\nSTRUCTURED INTENT")
        print("-" * 70)

        print(intent)

    except Exception as exc:

        print("\nFAILED")
        print(type(exc).__name__)
        print(str(exc))


print("\n" + "=" * 70)
print("TESTING UNSUPPORTED BRANCH")
print("=" * 70)

try:

    intent = parser.parse(
        "Which branch generated the highest revenue?"
    )

    print("ERROR: branch should have been rejected.")
    print(intent)

except IntentValidationError as exc:

    print("Correctly rejected:")
    print(exc)


unload_qwen_model()

print("\n" + "=" * 70)
print("TEST COMPLETED")
print("=" * 70)
