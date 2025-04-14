// src/frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [source, setSource] = useState('clickhouse');
  const [clickhouseConfig, setClickhouseConfig] = useState({
    host: '',
    port: '',
    database: '',
    user: '',
    jwt_token: ''
  });

  const handleConnect = async () => {
    try {
      const response = await axios.post('http://localhost:8000/connect/clickhouse', clickhouseConfig);
      // Handle response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="App">
      <h1>Data Ingestion Tool</h1>
      
      <div className="source-selection">
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="clickhouse">ClickHouse</option>
          <option value="flatfile">Flat File</option>
        </select>
      </div>

      {source === 'clickhouse' && (
        <div className="clickhouse-config">
          <input 
            placeholder="Host"
            value={clickhouseConfig.host}
            onChange={(e) => setClickhouseConfig({...clickhouseConfig, host: e.target.value})}
          />
          {/* Add other configuration inputs */}
          <button onClick={handleConnect}>Connect</button>
        </div>
      )}
    </div>
  );
}

export default App;