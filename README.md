# 🚀 ClickHouse Data Integrator

![ClickHouse](https://img.shields.io/badge/ClickHouse-FFCC00?style=for-the-badge&logo=clickhouse&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

A web-based tool for bidirectional data transfer between ClickHouse and flat files (CSV, TSV). Provides an intuitive interface for seamless data migration.

---

## ✨ Features

| Feature | Icon | Description |
|---------|------|-------------|
| **Bidirectional Transfer** | 🔄 | Export from ClickHouse to files or import files to ClickHouse |
| **Column Selection** | 📊 | Choose specific columns for transfer |
| **Data Preview** | 👀 | Preview first 100 rows before transfer |
| **Progress Tracking** | 📈 | Visual progress bar for operations |
| **Error Handling** | ❗ | User-friendly error messages |

---

## 🛠 Setup

### **Backend** (FastAPI)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate environment
# macOS/Linux:
source venv/bin/activate
# Windows:
.\venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start server
uvicorn app.main:app --reload
```

### **Frontend** (React)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

🌐 Access the application at: [http://localhost:3000](http://localhost:3000)

---

## 🖥 Usage

### Connect to ClickHouse
1. Enter connection details (Host, Port, Database, User, JWT Token)
2. Click "Connect" button

### Export Data (ClickHouse → File)
1. Select "ClickHouse" as source
2. Choose table and columns
3. Click "Transfer Data" to export to CSV

### Import Data (File → ClickHouse)
1. Select "Flat File" as source
2. Upload CSV and map columns
3. Click "Transfer Data" to import

---

## 🧪 Testing

### Backend Tests
```bash
pytest
```

### Frontend Tests
```bash
npm test
```

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── models/           # 🏗 Pydantic models
│   ├── services/         # ⚙️ ClickHouse service logic
│   ├── main.py           # 🚪 FastAPI entry point
│   └── tests/            # 🧪 Unit tests
└── requirements.txt      # 📦 Backend dependencies

frontend/
├── src/
│   ├── components/       # 🧩 React components
│   ├── config/          # ⚙️ Configuration
│   ├── services/        # 🔌 API services
│   ├── App.js           # 🏠 Main application
│   └── index.js         # 🔌 Entry point
└── package.json         # 📦 Frontend dependencies
```

---

## ⚠️ Known Issues

| Issue | Solution |
|-------|----------|
| Connection failures | Ensure ClickHouse server is running |
| JWT token errors | Verify token validity and expiration |
| Large file transfers | Consider chunking for files >1GB |

---
