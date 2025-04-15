# backend/app/services/clickhouse_service.py

from clickhouse_driver import Client
import pandas as pd
from typing import List, Dict, Any
from ..models.schemas import ClickHouseConfig, TableInfo

class ClickHouseService:
    def __init__(self, config: ClickHouseConfig):
        self.config = config
        self.client = self._create_client()

    def _create_client(self) -> Client:
        return Client(
            host=self.config.host,
            port=self.config.port,
            database=self.config.database,
            user=self.config.user,
            password=self.config.jwt_token
        )

    def test_connection(self) -> bool:
        try:
            self.client.execute('SELECT 1')
            return True
        except Exception as e:
            raise Exception(f"Connection failed: {str(e)}")

    def get_tables(self) -> List[TableInfo]:
        try:
            tables = self.client.execute('SHOW TABLES')
            result = []
            for table in tables:
                columns = self.get_table_columns(table[0])
                result.append(TableInfo(name=table[0], columns=columns))
            return result
        except Exception as e:
            raise Exception(f"Failed to get tables: {str(e)}")

    def get_table_columns(self, table_name: str) -> List[str]:
        query = f"DESCRIBE {table_name}"
        columns = self.client.execute(query)
        return [col[0] for col in columns]

    def export_to_file(self, table_name: str, columns: List[str], file_path: str) -> int:
        try:
            query = f"SELECT {','.join(columns)} FROM {table_name}"
            data = self.client.execute(query)
            df = pd.DataFrame(data, columns=columns)
            df.to_csv(file_path, index=False)
            return len(df)
        except Exception as e:
            raise Exception(f"Export failed: {str(e)}")

    def import_from_file(self, file_path: str, table_name: str, columns: List[str]) -> int:
        try:
            df = pd.read_csv(file_path)
            if columns:
                df = df[columns]
            
            # Create table if not exists
            columns_with_types = [f"{col} String" for col in df.columns]
            create_table_query = f"""
                CREATE TABLE IF NOT EXISTS {table_name}
                ({', '.join(columns_with_types)})
                ENGINE = MergeTree()
                ORDER BY tuple()
            """
            self.client.execute(create_table_query)

            # Insert data
            data = df.values.tolist()
            self.client.execute(f"INSERT INTO {table_name} VALUES", data)
            return len(df)
        except Exception as e:
            raise Exception(f"Import failed: {str(e)}")