# backend/app/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import *
from .services.clickhouse_service import ClickHouseService
from .services.file_service import FileService
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/connect")
async def test_connection(config: ClickHouseConfig):
    try:
        service = ClickHouseService(config)
        service.test_connection()
        return {"status": "success", "message": "Connection successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/tables")
async def get_tables(config: ClickHouseConfig):
    try:
        service = ClickHouseService(config)
        tables = service.get_tables()
        return {"status": "success", "tables": tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/transfer")
async def transfer_data(request: TransferRequest):
    try:
        service = ClickHouseService(request.config)
        
        if request.source_type == "clickhouse":
            records = service.export_to_file(
                request.table_name,
                request.selected_columns,
                request.file_path
            )
        else:
            records = service.import_from_file(
                request.file_path,
                request.table_name,
                request.selected_columns
            )
            
        return TransferResponse(
            status="success",
            records_processed=records,
            message="Transfer completed successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        return {"status": "success", "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/preview")
async def preview_data(file_path: str, columns: List[str], delimiter: str = ','):
    try:
        preview = FileService.preview_data(file_path, columns, delimiter)
        return {"status": "success", "data": preview}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))