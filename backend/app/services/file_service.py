# backend/app/services/file_service.py

import pandas as pd
from typing import List, Dict

class FileService:
    @staticmethod
    def get_file_schema(file_path: str, delimiter: str = ',') -> List[str]:
        try:
            df = pd.read_csv(file_path, delimiter=delimiter, nrows=1)
            return list(df.columns)
        except Exception as e:
            raise Exception(f"Failed to read file schema: {str(e)}")

    @staticmethod
    def preview_data(file_path: str, columns: List[str], delimiter: str = ',', rows: int = 100) -> List[Dict]:
        try:
            df = pd.read_csv(file_path, delimiter=delimiter, usecols=columns, nrows=rows)
            return df.to_dict('records')
        except Exception as e:
            raise Exception(f"Failed to preview data: {str(e)}")