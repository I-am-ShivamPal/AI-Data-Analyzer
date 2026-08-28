import sys
from pathlib import Path

sys.path.insert(
    0,
    str(Path(__file__).resolve().parents[1])
)

from sqlalchemy import text

from app.db.connection import engine


def main():

    print("=" * 70)
    print("AI DATA ANALYZER - POSTGRESQL CONNECTION TEST")
    print("=" * 70)

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT 1")
            )

            value = result.scalar()

            print()
            print("Database response:", value)

            assert value == 1

        print()
        print("PostgreSQL connection successful!")
        print("Database: ai_data_analyzer")
        print("Host: localhost")
        print("Port: 5432")

    except Exception as e:

        print()
        print("POSTGRESQL CONNECTION FAILED")
        print("-" * 70)
        print(type(e).__name__)
        print(str(e))

        raise


if __name__ == "__main__":
    main()
