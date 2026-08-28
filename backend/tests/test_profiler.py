import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.data_engine.profiler import DatasetProfiler
import json


print("=" * 70)
print("AI DATA ANALYZER - DATASET PROFILER TEST")
print("=" * 70)

file_path = "data/sample_sales.csv"

profiler = DatasetProfiler(file_path)

result = profiler.profile()

print("\nDATASET PROFILE\n")

print(
    json.dumps(
        result,
        indent=4,
        default=str
    )
)

print("\n" + "=" * 70)
print("TEST COMPLETED SUCCESSFULLY")
print("=" * 70)