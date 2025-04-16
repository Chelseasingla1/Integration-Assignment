# app/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional

class ClickHouseConfig(BaseModel):
    host: str = Field(..., description="ClickHouse server host")
    port: int = Field(..., description="ClickHouse server port")
    database: str = Field(..., description="Database name")
    user: str = Field(..., description="Username")
    password: str = Field(..., description="Password")  # Changed from jwt_token

    class Config:
        schema_extra = {
            "example": {
                "host": "localhost",
                "port": 9000,
                "database": "default",
                "user": "default",
                "password": ""
            }
        }

class TableInfo(BaseModel):
    name: str
    columns: List[str]

class TransferRequest(BaseModel):
    config: ClickHouseConfig
    source_type: str
    table_name: Optional[str]
    selected_columns: List[str]
    file_path: Optional[str]
    delimiter: Optional[str] = ','

class TransferResponse(BaseModel):
    status: str
    records_processed: int
    message: str