import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_engine.inspector import DatasetInspector
import json


print("=" * 70)
print("AI DATA ANALYZER - DATASET INSPECTOR TEST")
print("=" * 70)

file_path = "data/sample_sales.csv"

inspector = DatasetInspector(file_path)

result = inspector.inspect()

print("\nDATASET INSPECTION RESULT\n")

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