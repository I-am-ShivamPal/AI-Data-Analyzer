import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import time
import torch

from app.data_engine.inspector import DatasetInspector
from app.data_engine.profiler import DatasetProfiler
from app.ai_engine.context_builder import DatasetContextBuilder
from app.ai_engine.analysis_engine import QwenAnalysisEngine


print("=" * 70)
print("AI DATA ANALYZER - QWEN ANALYSIS ENGINE TEST")
print("=" * 70)


file_path = "data/sample_sales.csv"


print("\nSTEP 1: Inspecting dataset...")

inspector = DatasetInspector(file_path)

inspection_result = inspector.inspect()


print("\nSTEP 2: Profiling dataset...")

profiler = DatasetProfiler(file_path)

profile_result = profiler.profile()


print("\nSTEP 3: Building AI context...")

context_builder = DatasetContextBuilder(
    inspection_result,
    profile_result,
)

dataset_context = context_builder.build_context()

print(
    f"Dataset context size: "
    f"{len(dataset_context)} characters"
)


print("\nSTEP 4: Loading Qwen...")

engine = QwenAnalysisEngine()

engine.load_model()


questions = [

    "Which product generated the highest total revenue?",

    "Compare the different ordering channels and explain what analysis should be performed.",

    "Find possible unusual patterns or anomalies in this dataset.",

]


for index, question in enumerate(
    questions,
    start=1,
):

    print("\n" + "=" * 70)

    print(f"QUESTION {index}")

    print("=" * 70)

    print(question)

    print("\nGenerating analysis plan...")

    start_time = time.time()

    response = engine.analyze(
        dataset_context=dataset_context,
        user_question=question,
        max_new_tokens=400,
    )

    elapsed_time = time.time() - start_time

    print("\nAI ANALYSIS PLAN")

    print("-" * 70)

    print(response)

    print("-" * 70)

    print(
        f"Generation time: "
        f"{elapsed_time:.2f} seconds"
    )


print("\n" + "=" * 70)

print("GPU MEMORY")

print("=" * 70)

print(
    f"Allocated: "
    f"{torch.cuda.memory_allocated() / 1024**3:.2f} GB"
)

print(
    f"Reserved: "
    f"{torch.cuda.memory_reserved() / 1024**3:.2f} GB"
)


print("\nCleaning up...")

engine.unload_model()


print("\n" + "=" * 70)

print("TEST COMPLETED SUCCESSFULLY")

print("=" * 70)
