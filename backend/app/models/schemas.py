# app/models/schemas.py
from pydantic import BaseModel
from typing import List, Optional

class ClickHouseConfig(BaseModel):
    host: str
    port: int
    database: str
    user: str
    jwt_token: str

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