# tests/test_main.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_connect_clickhouse():
    test_config = {
        "host": "localhost",
        "port": 9000,
        "database": "default",
        "user": "default",
        "jwt_token": "test_token"
    }
    response = client.post("/connect/clickhouse", json=test_config)
    assert response.status_code == 200
    assert response.json()["status"] == "success"