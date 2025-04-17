// frontend/src/App.js
import React, { useState, useEffect } from 'react';
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
  Box,
  Tabs,
  Tab,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  CloudUpload,
  CloudDownload,
  Settings,
  TableChart,
  ViewList,
  Refresh,
  Visibility
} from '@material-ui/icons';
import axios from 'axios';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState('clickhouse_to_file');
  const [clickhouseConfig, setClickhouseConfig] = useState({
    host: 'localhost',
    port: 9000,
    database: 'default',
    user: 'default',
    jwt_token: ''
  });
  const [fileConfig, setFileConfig] = useState({
    filePath: '',
    delimiter: ',',
    hasHeader: true
  });
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [joinTables, setJoinTables] = useState([]);
  const [joinConditions, setJoinConditions] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Connect to ClickHouse
  const handleConnect = async () => {
    try {
      setLoading(true);
      setStatus({ message: 'Connecting to ClickHouse...', type: 'info' });
      
      const response = await axios.post('http://localhost:8000/api/connect', clickhouseConfig);
      
      setTables(response.data.tables);
      setStatus({ message: 'Connected successfully!', type: 'success' });
    } catch (error) {
      setStatus({ 
        message: `Connection failed: ${error.response?.data?.detail || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Load table columns
  const handleLoadColumns = async () => {
    if (!selectedTable) return;
    
    try {
      setLoading(true);
      setStatus({ message: `Loading columns for ${selectedTable}...`, type: 'info' });
      
      const response = await axios.post('http://localhost:8000/api/columns', {
        config: clickhouseConfig,
        table: selectedTable
      });
      
      setColumns(response.data.columns);
      setSelectedColumns(response.data.columns); // Select all by default
      setStatus({ message: `Loaded ${response.data.columns.length} columns`, type: 'success' });
    } catch (error) {
      setStatus({ 
        message: `Failed to load columns: ${error.response?.data?.detail || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileConfig({ ...fileConfig, filePath: file.name });
      setStatus({ message: `Selected file: ${file.name}`, type: 'info' });
    }
  };

  // Preview data
  const handlePreview = async () => {
    try {
      setLoading(true);
      setStatus({ message: 'Loading preview data...', type: 'info' });
      
      const formData = new FormData();
      if (file) formData.append('file', file);
      
      const response = await axios.post('http://localhost:8000/api/preview', {
        config: clickhouseConfig,
        direction,
        table: selectedTable,
        selectedColumns,
        fileConfig,
        joinConditions
      }, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      setPreviewData(response.data.preview);
      setShowPreview(true);
      setStatus({ message: 'Preview loaded successfully', type: 'success' });
    } catch (error) {
      setStatus({ 
        message: `Preview failed: ${error.response?.data?.detail || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Execute data transfer
  const handleTransfer = async () => {
    try {
      setLoading(true);
      setStatus({ message: 'Starting data transfer...', type: 'info' });
      
      const formData = new FormData();
      if (file) formData.append('file', file);
      
      const response = await axios.post('http://localhost:8000/api/transfer', {
        config: clickhouseConfig,
        direction,
        table: selectedTable,
        selectedColumns,
        fileConfig,
        joinConditions
      }, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      setStatus({ 
        message: `Transfer completed: ${response.data.records_processed} records processed`, 
        type: 'success' 
      });
    } catch (error) {
      setStatus({ 
        message: `Transfer failed: ${error.response?.data?.detail || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Add join condition
  const handleAddJoin = () => {
    setJoinConditions([...joinConditions, { leftTable: '', leftColumn: '', rightTable: '', rightColumn: '' }]);
  };

  // Update join condition
  const handleUpdateJoin = (index, field, value) => {
    const updated = [...joinConditions];
    updated[index][field] = value;
    setJoinConditions(updated);
  };

  // Remove join condition
  const handleRemoveJoin = (index) => {
    setJoinConditions(joinConditions.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 40 }}>
      <Paper elevation={3} style={{ padding: 24 }}>
        <Typography variant="h4" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          <Settings style={{ marginRight: 10 }} />
          Data Integration Tool
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Configuration" icon={<Settings />} />
          <Tab label="Data Selection" icon={<TableChart />} />
          <Tab label="Preview" icon={<Visibility />} disabled={!showPreview} />
        </Tabs>
        
        <Divider style={{ margin: '20px 0' }} />
        
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              <CloudUpload style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Data Transfer Direction
            </Typography>
            
            <FormControl component="fieldset" style={{ marginBottom: 20 }}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={direction === 'clickhouse_to_file'}
                      onChange={() => setDirection('clickhouse_to_file')}
                      color="primary"
                    />
                  }
                  label="ClickHouse to Flat File"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={direction === 'file_to_clickhouse'}
                      onChange={() => setDirection('file_to_clickhouse')}
                      color="primary"
                    />
                  }
                  label="Flat File to ClickHouse"
                />
              </FormGroup>
            </FormControl>
            
            <Typography variant="h6" gutterBottom>
              <TableChart style={{ verticalAlign: 'middle', marginRight: 8 }} />
              ClickHouse Configuration
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} style={{ marginBottom: 20 }}>
              <TextField
                label="Host"
                value={clickhouseConfig.host}
                onChange={(e) => setClickhouseConfig({ ...clickhouseConfig, host: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="Port"
                type="number"
                value={clickhouseConfig.port}
                onChange={(e) => setClickhouseConfig({ ...clickhouseConfig, port: parseInt(e.target.value) })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="Database"
                value={clickhouseConfig.database}
                onChange={(e) => setClickhouseConfig({ ...clickhouseConfig, database: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="Username"
                value={clickhouseConfig.user}
                onChange={(e) => setClickhouseConfig({ ...clickhouseConfig, user: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="JWT Token"
                type="password"
                value={clickhouseConfig.jwt_token}
                onChange={(e) => setClickhouseConfig({ ...clickhouseConfig, jwt_token: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleConnect}
              disabled={loading}
              startIcon={<Refresh />}
              style={{ marginBottom: 20 }}
            >
              Test Connection
            </Button>
            
            <Typography variant="h6" gutterBottom>
              <ViewList style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Flat File Configuration
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} style={{ marginBottom: 20 }}>
              <Box gridColumn="span 2">
                <input
                  accept=".csv,.txt"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    {file ? file.name : 'Select File'}
                  </Button>
                </label>
              </Box>
              <TextField
                label="Delimiter"
                value={fileConfig.delimiter}
                onChange={(e) => setFileConfig({ ...fileConfig, delimiter: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fileConfig.hasHeader}
                    onChange={(e) => setFileConfig({ ...fileConfig, hasHeader: e.target.checked })}
                    color="primary"
                  />
                }
                label="File has header row"
              />
            </Box>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box>
            {direction === 'clickhouse_to_file' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Table Selection
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2} style={{ marginBottom: 20 }}>
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel>Select Table</InputLabel>
                    <Select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      label="Select Table"
                    >
                      {tables.map((table) => (
                        <MenuItem key={table.name} value={table.name}>
                          {table.name} ({table.engine})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLoadColumns}
                    disabled={!selectedTable || loading}
                  >
                    Load Columns
                  </Button>
                </Box>
                
                {columns.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Column Selection ({selectedColumns.length} of {columns.length} selected)
                    </Typography>
                    
                    <Box display="flex" flexWrap="wrap" gap={1} style={{ marginBottom: 20 }}>
                      {columns.map((column) => (
                        <Chip
                          key={column}
                          label={column}
                          color={selectedColumns.includes(column) ? 'primary' : 'default'}
                          onClick={() => {
                            if (selectedColumns.includes(column)) {
                              setSelectedColumns(selectedColumns.filter(c => c !== column));
                            } else {
                              setSelectedColumns([...selectedColumns, column]);
                            }
                          }}
                          variant={selectedColumns.includes(column) ? 'default' : 'outlined'}
                        />
                      ))}
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" style={{ marginBottom: 20 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedColumns(columns)}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedColumns([])}
                      >
                        Clear All
                      </Button>
                    </Box>
                  </>
                )}
                
                <Typography variant="h6" gutterBottom>
                  Table Joins (Bonus Feature)
                </Typography>
                
                {joinConditions.map((condition, index) => (
                  <Box key={index} display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} style={{ marginBottom: 10 }}>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Left Table</InputLabel>
                      <Select
                        value={condition.leftTable}
                        onChange={(e) => handleUpdateJoin(index, 'leftTable', e.target.value)}
                        label="Left Table"
                      >
                        {tables.map((table) => (
                          <MenuItem key={table.name} value={table.name}>
                            {table.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Left Column</InputLabel>
                      <Select
                        value={condition.leftColumn}
                        onChange={(e) => handleUpdateJoin(index, 'leftColumn', e.target.value)}
                        label="Left Column"
                        disabled={!condition.leftTable}
                      >
                        {columns.map((column) => (
                          <MenuItem key={column} value={column}>
                            {column}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Right Table</InputLabel>
                      <Select
                        value={condition.rightTable}
                        onChange={(e) => handleUpdateJoin(index, 'rightTable', e.target.value)}
                        label="Right Table"
                      >
                        {tables.map((table) => (
                          <MenuItem key={table.name} value={table.name}>
                            {table.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Right Column</InputLabel>
                      <Select
                        value={condition.rightColumn}
                        onChange={(e) => handleUpdateJoin(index, 'rightColumn', e.target.value)}
                        label="Right Column"
                        disabled={!condition.rightTable}
                      >
                        {columns.map((column) => (
                          <MenuItem key={column} value={column}>
                            {column}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton onClick={() => handleRemoveJoin(index)} style={{ gridColumn: 'span 4' }}>
                      Remove
                    </IconButton>
                  </Box>
                ))}
                
                <Button
                  variant="outlined"
                  onClick={handleAddJoin}
                  style={{ marginBottom: 20 }}
                >
                  Add Join Condition
                </Button>
              </>
            )}
            
            {direction === 'file_to_clickhouse' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Target Table Configuration
                </Typography>
                
                <TextField
                  label="Target Table Name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{ marginBottom: 20 }}
                />
                
                <Typography variant="subtitle1" gutterBottom>
                  Map File Columns to Database Columns
                </Typography>
                
                {/* This would be dynamically generated based on file headers */}
                <TableContainer component={Paper} style={{ marginBottom: 20 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>File Column</TableCell>
                        <TableCell>Database Column</TableCell>
                        <TableCell>Data Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>column1</TableCell>
                        <TableCell>
                          <TextField size="small" fullWidth />
                        </TableCell>
                        <TableCell>
                          <Select size="small" fullWidth>
                            <MenuItem value="String">String</MenuItem>
                            <MenuItem value="Int32">Integer</MenuItem>
                            <MenuItem value="Float64">Float</MenuItem>
                            <MenuItem value="Date">Date</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        )}
        
        {activeTab === 2 && showPreview && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Data Preview (First 100 Rows)
            </Typography>
            
            <TableContainer component={Paper} style={{ maxHeight: 500, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {selectedColumns.map((column) => (
                      <TableCell key={column}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {selectedColumns.map((column) => (
                        <TableCell key={`${rowIndex}-${column}`}>
                          {row[column] !== null && row[column] !== undefined ? row[column].toString() : 'NULL'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        <Divider style={{ margin: '20px 0' }} />
        
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Tooltip title="Preview the data before transfer">
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePreview}
              disabled={loading || (direction === 'clickhouse_to_file' && (!selectedTable || selectedColumns.length === 0))}
              startIcon={<Visibility />}
            >
              Preview
            </Button>
          </Tooltip>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleTransfer}
            disabled={loading || (direction === 'clickhouse_to_file' && (!selectedTable || selectedColumns.length === 0))}
            startIcon={direction === 'clickhouse_to_file' ? <CloudDownload /> : <CloudUpload />}
          >
            {direction === 'clickhouse_to_file' ? 'Export to File' : 'Import to ClickHouse'}
          </Button>
        </Box>
        
        {loading && (
          <Box style={{ marginTop: 20 }}>
            <LinearProgress variant={progress > 0 ? 'determinate' : 'indeterminate'} value={progress} />
            <Typography variant="caption" display="block" align="center">
              {progress > 0 ? `${progress}% complete` : 'Processing...'}
            </Typography>
          </Box>
        )}
        
        {status.message && (
          <Box 
            style={{ 
              marginTop: 20,
              padding: 10,
              backgroundColor: status.type === 'error' ? '#ffebee' : 
                             status.type === 'success' ? '#e8f5e9' : '#e3f2fd',
              borderRadius: 4
            }}
          >
            <Typography 
              variant="body2" 
              style={{ 
                color: status.type === 'error' ? '#c62828' : 
                      status.type === 'success' ? '#2e7d32' : '#1565c0'
              }}
            >
              {status.message}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;