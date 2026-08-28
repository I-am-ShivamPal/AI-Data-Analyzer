import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor


DATASET = "data/sample_sales.csv"

print("=" * 70)
print("SAFE FILTERED QUERY TEST")
print("=" * 70)


import duckdb

connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

mapper = SchemaMapper(columns)
schema = mapper.get_result()

executor = QueryExecutor(
    dataset_path=DATASET,
    schema_mapper=mapper
)


# ---------------------------------------------------------
# TEST 1
# ---------------------------------------------------------

print("\nTEST 1: Revenue in Virginia")
print("-" * 70)

result = executor.total_revenue_filtered({
    "location": "Virginia"
})

print(result)

assert result["value"] >= 0


# ---------------------------------------------------------
# TEST 2
# ---------------------------------------------------------

print("\nTEST 2: Top product in Virginia")
print("-" * 70)

result = executor.top_product_by_revenue_filtered(
    filters={
        "location": "Virginia"
    },
    limit=1
)

print(result)

assert len(result) == 1


# ---------------------------------------------------------
# TEST 3
# ---------------------------------------------------------

print("\nTEST 3: Virginia + Website")
print("-" * 70)

result = executor.top_product_by_revenue_filtered(
    filters={
        "location": "Virginia",
        "channel": "Website"
    },
    limit=1
)

print(result)

assert len(result) == 1


# ---------------------------------------------------------
# TEST 4
# ---------------------------------------------------------

print("\nTEST 4: Invalid branch filter")
print("-" * 70)

try:

    executor.total_revenue_filtered({
        "branch": "Mumbai"
    })

    raise AssertionError(
        "branch should have been rejected"
    )

except ValueError as error:

    print("Correctly rejected:")
    print(error)


executor.close()


print("\n" + "=" * 70)
print("FILTERED QUERY TEST COMPLETED SUCCESSFULLY")
print("=" * 70)
