from pathlib import Path
import os
import pandas as pd


class DatasetInspector:
    """
    Inspects datasets without sending the full dataset to an LLM.
    Supports CSV initially.
    Excel support will be added later.
    """

    def __init__(self, file_path):
        self.file_path = Path(file_path)

        if not self.file_path.exists():
            raise FileNotFoundError(
                f"File not found: {self.file_path}"
            )

    def get_file_info(self):
        """Return basic file information."""

        size_bytes = os.path.getsize(self.file_path)

        return {
            "file_name": self.file_path.name,
            "file_path": str(self.file_path),
            "file_extension": self.file_path.suffix.lower(),
            "file_size_bytes": size_bytes,
            "file_size_mb": round(
                size_bytes / (1024 * 1024), 2
            ),
        }

    def inspect_csv(self, sample_rows=5):
        """
        Inspect a CSV file using Pandas.

        Uses chunked processing so the entire
        dataset does not need to be loaded
        into memory at once.
        """

        print("\nReading CSV...")

        chunk_size = 100_000

        total_rows = 0
        missing_values = None
        data_types = None
        column_names = None
        sample_data = []

        for chunk in pd.read_csv(
            self.file_path,
            chunksize=chunk_size
        ):

            total_rows += len(chunk)

            if column_names is None:

                column_names = chunk.columns.tolist()

                data_types = {
                    column: str(dtype)
                    for column, dtype
                    in chunk.dtypes.items()
                }

                missing_values = {
                    column: 0
                    for column in chunk.columns
                }

            for column in chunk.columns:

                missing_values[column] += int(
                    chunk[column].isna().sum()
                )

            if len(sample_data) < sample_rows:

                remaining = (
                    sample_rows - len(sample_data)
                )

                records = (
                    chunk.head(remaining)
                    .where(
                        pd.notnull(chunk.head(remaining)),
                        None
                    )
                    .to_dict(orient="records")
                )

                sample_data.extend(records)

        return {
            "file_info": self.get_file_info(),
            "dataset_info": {
                "rows": total_rows,
                "columns": len(column_names),
                "column_names": column_names,
                "data_types": data_types,
                "missing_values": missing_values,
                "sample_data": sample_data,
            },
        }

    def inspect(self):
        """
        Automatically select the correct inspector.
        """

        extension = self.file_path.suffix.lower()

        if extension == ".csv":
            return self.inspect_csv()

        raise ValueError(
            f"Unsupported file type: {extension}"
        )