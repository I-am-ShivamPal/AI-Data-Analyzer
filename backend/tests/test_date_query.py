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

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor


DATASET = "data/sample_sales.csv"


print("=" * 70)
print("DATE QUERY TEST")
print("=" * 70)

import duckdb
connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

mapper = SchemaMapper(columns)
mapper.get_result()

executor = QueryExecutor(
    dataset_path=DATASET,
    schema_mapper=mapper
)


# ---------------------------------------------------------
# TEST 1
# ---------------------------------------------------------

print("\nTEST 1: Revenue in March")
print("-" * 70)

result = executor.total_revenue_filtered({
    "date": "March"
})

print(result)

assert result["value"] >= 0


# ---------------------------------------------------------
# TEST 2
# ---------------------------------------------------------

print("\nTEST 2: Revenue in March + Virginia")
print("-" * 70)

result = executor.total_revenue_filtered({
    "date": "March",
    "location": "Virginia"
})

print(result)

assert result["value"] >= 0


# ---------------------------------------------------------
# TEST 3
# ---------------------------------------------------------

print("\nTEST 3: Top product in March")
print("-" * 70)

result = executor.top_product_by_revenue_filtered(
    filters={
        "date": "March"
    },
    limit=1
)

print(result)

assert len(result) == 1


# ---------------------------------------------------------
# TEST 4
# ---------------------------------------------------------

print("\nTEST 4: Top product in March + Virginia")
print("-" * 70)

result = executor.top_product_by_revenue_filtered(
    filters={
        "date": "March",
        "location": "Virginia"
    },
    limit=1
)

print(result)

assert len(result) == 1


executor.close()


print("\n" + "=" * 70)
print("DATE QUERY TEST PASSED")
print("=" * 70)
