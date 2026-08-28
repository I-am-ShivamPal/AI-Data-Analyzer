import gc
import sys
import os
import torch

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ai.qwen_model import (
    get_qwen_model,
    unload_qwen_model,
)
from app.data_engine.question_parser import QuestionParser
from app.data_engine.answer_generator import AnswerGenerator


print("=" * 70)
print("AI DATA ANALYZER - SHARED QWEN MEMORY TEST")
print("=" * 70)


def memory(label):

    if not torch.cuda.is_available():
        print(f"{label}: CUDA unavailable")
        return

    allocated = (
        torch.cuda.memory_allocated(0)
        / 1024**3
    )

    reserved = (
        torch.cuda.memory_reserved(0)
        / 1024**3
    )

    print(
        f"{label}\n"
        f"  GPU allocated: {allocated:.2f} GB\n"
        f"  GPU reserved:  {reserved:.2f} GB"
    )


# ---------------------------------------------------------
# TEST 1
# ---------------------------------------------------------

print("\nTEST 1: Loading shared Qwen")
print("-" * 70)

qwen = get_qwen_model()

memory("After Qwen loading")


# ---------------------------------------------------------
# TEST 2
# ---------------------------------------------------------

print("\nTEST 2: Creating parser")
print("-" * 70)

parser = QuestionParser(qwen)

memory("After parser creation")


# ---------------------------------------------------------
# TEST 3
# ---------------------------------------------------------

print("\nTEST 3: Creating answer generator")
print("-" * 70)

answer_generator = AnswerGenerator(qwen)

memory("After answer generator creation")


# ---------------------------------------------------------
# TEST 4
# ---------------------------------------------------------

print("\nTEST 4: Question parsing")
print("-" * 70)

question = (
    "Which product generated the highest revenue?"
)

schema = {
    "source_columns": ["product_name", "revenue"],
    "semantic_mapping": {
        "product": "product_name",
        "revenue": "revenue"
    },
    "derived_metrics": {}
}

intent = parser.parse(question=question, schema=schema)

print("\nIntent:")
print(intent)

memory("After question parsing")


# ---------------------------------------------------------
# TEST 5
# ---------------------------------------------------------

print("\nTEST 5: Answer generation")
print("-" * 70)

verified_result = {
    "product": "Drone",
    "revenue": 2537181.00,
    "units_sold": 1286,
    "orders": 433,
}

context = {
    "question": question,
    "result": verified_result,
}

answer = answer_generator.generate(context=context)

print("\nAnswer:")
print(answer)

memory("After answer generation")


# ---------------------------------------------------------
# TEST 6
# ---------------------------------------------------------

print("\nTEST 6: Repeated generation")
print("-" * 70)

for i in range(1, 4):

    print(f"\nGeneration {i}")

    answer = answer_generator.generate(context=context)

    print(answer)

    gc.collect()

    if torch.cuda.is_available():
        torch.cuda.synchronize()

    memory(f"After generation {i}")


# ---------------------------------------------------------
# FINAL
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("FINAL MEMORY STATE")
print("=" * 70)

memory("Final")


# ---------------------------------------------------------
# CLEANUP
# ---------------------------------------------------------

print("\nCleaning up shared Qwen...")

unload_qwen_model()

memory("After unload")

print("\n" + "=" * 70)
print("SHARED QWEN TEST COMPLETED")
print("=" * 70)
