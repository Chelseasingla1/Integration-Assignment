// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  LinearProgress,
} from '@material-ui/core';

function App() {
  const [config, setConfig] = useState({
    host: '',
    port: 9000,
    database: '',
    user: '',
    jwt_token: ''
  });
  const [sourceType, setSourceType] = useState('clickhouse');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/connect', config);
      const response = await axios.post('http://localhost:8000/api/tables', config);
      setTables(response.data.tables);
      setStatus('Connected successfully');
    } catch (error) {
      setStatus(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/api/transfer', {
        config,
        source_type: sourceType,
        table_name: selectedTable,
        selected_columns: selectedColumns,
        file_path: file ? file.name : null
      });

      setStatus(`Transfer completed: ${response.data.records_processed} records processed`);
    } catch (error) {
      setStatus(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5">ClickHouse Data Integrator</Typography>

        {/* Connection Configuration */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Host"
            value={config.host}
            onChange={(e) => setConfig({ ...config, host: e.target.value })}
          />
          {/* Add other config fields */}
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleConnect}
          disabled={loading}
        >
          Connect
        </Button>

        {/* Source Type Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Source Type</InputLabel>
          <Select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            <MenuItem value="clickhouse">ClickHouse</MenuItem>
            <MenuItem value="file">File</MenuItem>
          </Select>
        </FormControl>

        {/* Table Selection */}
        {sourceType === 'clickhouse' && tables.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Table</InputLabel>
            <Select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              {tables.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* File Upload */}
        {sourceType === 'file' && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".csv"
          />
        )}

        {/* Column Selection */}
        {columns.length > 0 && (
          <FormGroup>
            {columns.map((column) => (
              <FormControlLabel
                key={column}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(column)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedColumns([...selectedColumns, column]);
                      } else {
                        setSelectedColumns(selectedColumns.filter((c) => c !== column));
                      }
                    }}
                  />
                }
                label={column}
              />
            ))}
          </FormGroup>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleTransfer}
          disabled={loading || !selectedColumns.length}
        >
          Transfer Data
        </Button>

        {loading && <LinearProgress />}
        
        {status && (
          <Typography color="textSecondary" style={{ marginTop: 10 }}>
            {status}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default App;