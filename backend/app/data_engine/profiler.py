from pathlib import Path
import pandas as pd


class DatasetProfiler:
    """
    Generates statistical and data-quality profiles
    for a dataset.
    """

    def __init__(self, file_path):
        self.file_path = Path(file_path)

        if not self.file_path.exists():
            raise FileNotFoundError(
                f"File not found: {self.file_path}"
            )

        self.df = None

    def load_csv(self):
        """Load CSV dataset."""

        print("\nLoading dataset...")

        self.df = pd.read_csv(
            self.file_path
        )

    def get_numeric_profile(self):
        """Analyze numeric columns."""

        numeric_profile = {}

        numeric_columns = self.df.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:

            series = self.df[column]

            numeric_profile[column] = {
                "count": int(series.count()),
                "null_count": int(series.isna().sum()),
                "min": series.min(),
                "max": series.max(),
                "mean": series.mean(),
                "median": series.median(),
                "std": series.std(),
            }

        return numeric_profile

    def get_text_profile(self, top_n=5):
        """Analyze text columns."""

        text_profile = {}

        text_columns = self.df.select_dtypes(
            include=["object", "string"]
        ).columns

        for column in text_columns:

            series = self.df[column]

            unique_count = int(
                series.nunique(dropna=True)
            )

            value_counts = (
                series
                .value_counts(dropna=False)
                .head(top_n)
            )

            top_values = [
                {
                    column: value,
                    "len": int(count),
                }
                for value, count in value_counts.items()
            ]

            text_profile[column] = {
                "unique_values": unique_count,
                "top_values": top_values,
            }

        return text_profile

    def get_data_quality(self):
        """Check overall dataset quality."""

        total_rows = len(self.df)

        duplicate_rows = int(
            self.df.duplicated().sum()
        )

        constant_columns = []

        for column in self.df.columns:

            if self.df[column].nunique(
                dropna=False
            ) <= 1:
                constant_columns.append(column)

        missing_values = {
            column: int(
                self.df[column].isna().sum()
            )
            for column in self.df.columns
        }

        return {
            "total_rows": total_rows,
            "duplicate_rows": duplicate_rows,
            "constant_columns": constant_columns,
            "missing_values": missing_values,
        }

    def detect_possible_dates(self):
        """
        Detect columns that may represent dates.
        """

        possible_dates = []

        date_keywords = [
            "date",
            "time",
            "timestamp",
            "created",
            "updated",
            "year",
            "month",
            "day"
        ]

        for column in self.df.columns:

            column_lower = column.lower()

            if any(
                keyword in column_lower
                for keyword in date_keywords
            ):
                possible_dates.append(column)

        return possible_dates

    def profile(self):
        """Generate the complete dataset profile."""

        if self.file_path.suffix.lower() != ".csv":
            raise ValueError(
                "Currently only CSV files are supported."
            )

        self.load_csv()

        return {
            "dataset": {
                "file_name": self.file_path.name,
                "rows": len(self.df),
                "columns": len(self.df.columns),
            },

            "numeric_columns": self.get_numeric_profile(),

            "text_columns": self.get_text_profile(),

            "data_quality": self.get_data_quality(),

            "possible_date_columns":
                self.detect_possible_dates(),
        }