from pathlib import Path
import pandas as pd
import duckdb


class LargeDatasetEngine:
    """
    Engine designed for analyzing large datasets.

    Uses:
    - Pandas for smaller in-memory operations
    - DuckDB for large dataset SQL analytics
    """

    def __init__(self, file_path):
        self.file_path = Path(file_path)

        if not self.file_path.exists():
            raise FileNotFoundError(
                f"File not found: {self.file_path}"
            )

        self.extension = self.file_path.suffix.lower()

    def _get_csv_path(self):
        """
        Return a normalized absolute path
        compatible with DuckDB.
        """

        return str(
            self.file_path.resolve()
        ).replace("\\", "/")

    def get_schema(self):
        """
        Get dataset schema using DuckDB.

        The full dataset is not loaded into
        Pandas memory.
        """

        if self.extension != ".csv":
            raise ValueError(
                f"Unsupported file type: {self.extension}"
            )

        connection = duckdb.connect()

        try:

            path = self._get_csv_path()

            result = connection.execute(
                f"""
                DESCRIBE
                SELECT *
                FROM read_csv_auto('{path}')
                """
            ).fetchall()

            return {
                row[0]: row[1]
                for row in result
            }

        finally:
            connection.close()

    def count_rows(self):
        """
        Count rows using DuckDB.
        """

        if self.extension != ".csv":
            raise ValueError(
                f"Unsupported file type: {self.extension}"
            )

        connection = duckdb.connect()

        try:

            path = self._get_csv_path()

            result = connection.execute(
                f"""
                SELECT COUNT(*) AS row_count
                FROM read_csv_auto('{path}')
                """
            ).fetchone()

            return result[0]

        finally:
            connection.close()

    def get_sample(self, rows=5):
        """
        Read only a small sample.
        """

        if self.extension != ".csv":
            raise ValueError(
                f"Unsupported file type: {self.extension}"
            )

        df = pd.read_csv(
            self.file_path,
            nrows=rows
        )

        return df.to_dict(
            orient="records"
        )

    def get_numeric_summary(self):
        """
        Calculate numeric summary statistics
        using DuckDB.
        """

        schema = self.get_schema()

        numeric_types = {
            "TINYINT",
            "SMALLINT",
            "INTEGER",
            "BIGINT",
            "HUGEINT",
            "UTINYINT",
            "USMALLINT",
            "UINTEGER",
            "UBIGINT",
            "FLOAT",
            "DOUBLE",
            "DECIMAL",
            "REAL",
        }

        numeric_columns = [
            column
            for column, dtype in schema.items()
            if any(
                numeric_type in dtype.upper()
                for numeric_type in numeric_types
            )
        ]

        if not numeric_columns:
            return {}

        path = self._get_csv_path()

        expressions = []

        for column in numeric_columns:

            expressions.append(
                f"""
                MIN("{column}") AS "{column}__min",
                MAX("{column}") AS "{column}__max",
                AVG("{column}") AS "{column}__mean",
                MEDIAN("{column}") AS "{column}__median"
                """
            )

        query = f"""
            SELECT
                {",".join(expressions)}
            FROM read_csv_auto('{path}')
        """

        connection = duckdb.connect()

        try:

            result = connection.execute(
                query
            ).fetchone()

            columns = [
                description[0]
                for description
                in connection.description
            ]

            result_dict = dict(
                zip(columns, result)
            )

            summary = {}

            for column in numeric_columns:

                summary[column] = {
                    "min": result_dict[
                        f"{column}__min"
                    ],
                    "max": result_dict[
                        f"{column}__max"
                    ],
                    "mean": result_dict[
                        f"{column}__mean"
                    ],
                    "median": result_dict[
                        f"{column}__median"
                    ],
                }

            return summary

        finally:
            connection.close()

    def duckdb_query(self, query):
        """
        Execute an analytical SQL query
        directly against the dataset.
        """

        if self.extension != ".csv":
            raise ValueError(
                "DuckDB query currently supports CSV."
            )

        connection = duckdb.connect()

        try:

            path = self._get_csv_path()

            connection.execute(
                f"""
                CREATE VIEW dataset AS
                SELECT *
                FROM read_csv_auto('{path}')
                """
            )

            cursor = connection.execute(query)

            column_names = [
                description[0]
                for description in cursor.description
            ]

            rows = cursor.fetchall()

            return [
                dict(zip(column_names, row))
                for row in rows
            ]

        finally:
            connection.close()