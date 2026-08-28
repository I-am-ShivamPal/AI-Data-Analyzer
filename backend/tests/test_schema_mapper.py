"""
Test for Semantic Schema Mapper.
"""

import json
import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_engine.schema_mapper import SchemaMapper


print("=" * 70)
print("AI DATA ANALYZER - SEMANTIC SCHEMA MAPPER TEST")
print("=" * 70)


# ---------------------------------------------------------
# Test dataset
# ---------------------------------------------------------

columns = [
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
]


print("\nDataset columns:")
for column in columns:
    print(f"  - {column}")


# ---------------------------------------------------------
# Create mapper
# ---------------------------------------------------------

mapper = SchemaMapper(columns)

result = mapper.get_result()


# ---------------------------------------------------------
# Display semantic mapping
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("SEMANTIC MAPPING")
print("-" * 70)

for field, column in result["semantic_mapping"].items():

    if column:
        print(f"{field:<20} -> {column}")
    else:
        print(f"{field:<20} -> NOT FOUND")


# ---------------------------------------------------------
# Display derived metrics
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("DERIVED METRICS")
print("-" * 70)

if result["derived_metrics"]:

    for metric, definition in result["derived_metrics"].items():

        print(f"\n{metric}")
        print(f"  Formula: {definition['formula']}")
        print(f"  Description: {definition['description']}")
        print(f"  Source columns: {definition['source_columns']}")

else:
    print("No derived metrics detected.")


# ---------------------------------------------------------
# Validation
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("VALIDATION")
print("-" * 70)


expected_mapping = {
    "product": "product_name",
    "product_id": "productID",
    "price": "product_price",
    "quantity": "number_of_ordered_items",
    "date": "date",
    "location": "location",
    "latitude": "latitude",
    "longitude": "longitude",
    "customer": "customer_name",
    "status": "order_status",
    "channel": "channel_of_ordering",
}


for field, expected_column in expected_mapping.items():

    actual_column = result["semantic_mapping"].get(field)

    assert actual_column == expected_column, (
        f"Mapping failed for '{field}'. "
        f"Expected '{expected_column}', got '{actual_column}'"
    )


# Revenue should be derived because the dataset
# has price + quantity but no revenue column.

assert "revenue" in result["derived_metrics"]

revenue_info = result["derived_metrics"]["revenue"]

assert revenue_info["formula"] == "price * quantity"

assert revenue_info["source_columns"]["price"] == "product_price"

assert (
    revenue_info["source_columns"]["quantity"]
    == "number_of_ordered_items"
)


print("\nAll semantic mappings are correct.")
print("Revenue derivation detected correctly.")


# ---------------------------------------------------------
# Print JSON result
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("FINAL SCHEMA RESULT")
print("-" * 70)

print(
    json.dumps(
        result,
        indent=2,
        default=str,
    )
)


print("\n" + "=" * 70)
print("TEST COMPLETED SUCCESSFULLY")
print("=" * 70)
