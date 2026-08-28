import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import json

from app.data_engine.inspector import DatasetInspector
from app.data_engine.profiler import DatasetProfiler
from app.ai_engine.context_builder import DatasetContextBuilder


print("=" * 70)
print("AI DATA ANALYZER - DATASET CONTEXT BUILDER TEST")
print("=" * 70)

file_path = "data/sample_sales.csv"


print("\nInspecting dataset...")

inspector = DatasetInspector(file_path)

inspection_result = inspector.inspect()


print("Profiling dataset...")

profiler = DatasetProfiler(file_path)

profile_result = profiler.profile()


print("\nBuilding AI context...")

context_builder = DatasetContextBuilder(
    inspection_result=inspection_result,
    profile_result=profile_result
)


print("\n" + "=" * 70)
print("DATASET SUMMARY")
print("=" * 70)

summary = context_builder.build_summary()

print(summary)


print("\n" + "=" * 70)
print("AI CONTEXT")
print("=" * 70)

context = context_builder.build_context()

print(context[:5000])


print("\n" + "=" * 70)
print("CONTEXT SIZE")
print("=" * 70)

print(f"Characters: {len(context)}")


print("\n" + "=" * 70)
print("TEST COMPLETED SUCCESSFULLY")
print("=" * 70)