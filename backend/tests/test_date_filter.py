import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from app.data_engine.date_filter import resolve_date_filter


print("=" * 70)
print("DATE FILTER RESOLVER TEST")
print("=" * 70)

dataset_range = {
    "start": "2024-01-01",
    "end": "2024-11-29"
}

# ---------------------------------------------------------
# TEST 1
# ---------------------------------------------------------

print("\nTEST 1: March")

result = resolve_date_filter(
    "March",
    dataset_date_range=dataset_range
)

print(result)

assert result == {
    "start": "2024-03-01",
    "end": "2024-03-31"
}


# ---------------------------------------------------------
# TEST 2
# ---------------------------------------------------------

print("\nTEST 2: March 2024")

result = resolve_date_filter(
    "March 2024",
    dataset_date_range=dataset_range
)

print(result)

assert result == {
    "start": "2024-03-01",
    "end": "2024-03-31"
}


# ---------------------------------------------------------
# TEST 3
# ---------------------------------------------------------

print("\nTEST 3: February 2024")

result = resolve_date_filter(
    "February 2024",
    dataset_date_range=dataset_range
)

print(result)

assert result == {
    "start": "2024-02-01",
    "end": "2024-02-29"
}


# ---------------------------------------------------------
# TEST 4
# ---------------------------------------------------------

print("\nTEST 4: March 2025 (Dynamic)")

dataset_range_2025 = {
    "start": "2025-01-01",
    "end": "2025-12-31"
}

result = resolve_date_filter(
    "March",
    dataset_date_range=dataset_range_2025
)

print(result)

assert result == {
    "start": "2025-03-01",
    "end": "2025-03-31"
}


# ---------------------------------------------------------
# TEST 5
# ---------------------------------------------------------

print("\nTEST 5: March 2026 (Explicit)")

result = resolve_date_filter(
    "March 2026",
    dataset_date_range=dataset_range
)

print(result)

assert result == {
    "start": "2026-03-01",
    "end": "2026-03-31"
}

print("\n" + "=" * 70)
print("DATE FILTER TEST PASSED")
print("=" * 70)
