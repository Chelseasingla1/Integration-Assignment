# ClickHouse Data Integrator

A web-based tool for bidirectional data transfer between ClickHouse and flat files.

## Features

- ClickHouse to File transfer
- File to ClickHouse transfer
- Column selection
- Data preview
- Progress tracking
- Error handling

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload