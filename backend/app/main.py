# src/backend/main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from clickhouse_driver import Client
import pandas as pd

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ClickHouse connection configuration
class ClickHouseConfig:
    def __init__(self, host, port, database, user, jwt_token):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.jwt_token = jwt_token

# API endpoints
@app.post("/connect/clickhouse")
async def connect_clickhouse(config: ClickHouseConfig):
    try:
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        return {"status": "success", "message": "Connected to ClickHouse"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/tables/clickhouse")
async def get_clickhouse_tables(config: ClickHouseConfig):
    try:
        client = Client(...)  # Similar connection as above
        tables = client.execute("SHOW TABLES")
        return {"status": "success", "tables": tables}
    except Exception as e:
        return {"status": "error", "message": str(e)}