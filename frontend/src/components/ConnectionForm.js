// // frontend/src/components/ConnectionForm.js
// import React, { useState } from 'react';
// import { TextField, Button, Paper, Typography } from '@material-ui/core';
// import { getDefaultClickHouseConfig } from '../config';
// import { connectToClickHouse } from '../services/api';

// const ConnectionForm = () => {
//     const [config, setConfig] = useState(getDefaultClickHouseConfig());
//     const [status, setStatus] = useState('');

//     const handleConnect = async (e) => {
//         e.preventDefault();
//         try {
//             setStatus('Connecting...');
//             const response = await connectToClickHouse(config);
//             setStatus('Connected successfully!');
//         } catch (error) {
//             setStatus(`Connection failed: ${error}`);
//         }
//     };

//     return (
//         <Paper style={{ padding: 20, maxWidth: 400, margin: '20px auto' }}>
//             <Typography variant="h6">ClickHouse Connection</Typography>
//             <form onSubmit={handleConnect}>
//                 <TextField
//                     fullWidth
//                     label="Host"
//                     value={config.host}
//                     onChange={(e) => setConfig({ ...config, host: e.target.value })}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="Port"
//                     type="number"
//                     value={config.port}
//                     onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="Database"
//                     value={config.database}
//                     onChange={(e) => setConfig({ ...config, database: e.target.value })}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="User"
//                     value={config.user}
//                     onChange={(e) => setConfig({ ...config, user: e.target.value })}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="JWT Token"
//                     type="password"
//                     value={config.jwt_token}
//                     onChange={(e) => setConfig({ ...config, jwt_token: e.target.value })}
//                     margin="normal"
//                 />
//                 <Button 
//                     type="submit" 
//                     variant="contained" 
//                     color="primary" 
//                     fullWidth 
//                     style={{ marginTop: 20 }}
//                 >
//                     Connect
//                 </Button>
//             </form>
//             {status && (
//                 <Typography 
//                     style={{ 
//                         marginTop: 20, 
//                         color: status.includes('failed') ? 'red' : 'green' 
//                     }}
//                 >
//                     {status}
//                 </Typography>
//             )}
//         </Paper>
//     );
// };

// export default ConnectionForm;
// frontend/src/components/ConnectionForm.js
import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@material-ui/core';

const ConnectionForm = () => {
    const [config, setConfig] = useState({
        host: 'localhost',
        port: 9000,
        database: 'default',
        user: 'default',
        password: ''  // Changed from jwt_token
    });
    const [status, setStatus] = useState('');

    const handleConnect = async (e) => {
        e.preventDefault();
        try {
            setStatus('Connecting...');
            const response = await fetch('http://localhost:8000/api/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Connection failed');
            }

            const data = await response.json();
            setStatus('Connected successfully!');
        } catch (error) {
            console.error('Connection error:', error);
            setStatus(`Connection failed: ${error.message}`);
        }
    };

    return (
        <Paper style={{ padding: 20, maxWidth: 400, margin: '20px auto' }}>
            <Typography variant="h6">ClickHouse Connection</Typography>
            <form onSubmit={handleConnect}>
                <TextField
                    fullWidth
                    label="Host"
                    value={config.host}
                    onChange={(e) => setConfig({ ...config, host: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Port"
                    type="number"
                    value={config.port}
                    onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Database"
                    value={config.database}
                    onChange={(e) => setConfig({ ...config, database: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="User"
                    value={config.user}
                    onChange={(e) => setConfig({ ...config, user: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                    margin="normal"
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    style={{ marginTop: 20 }}
                >
                    Connect
                </Button>
            </form>
            {status && (
                <Typography 
                    style={{ 
                        marginTop: 20, 
                        color: status.includes('failed') ? 'red' : 'green' 
                    }}
                >
                    {status}
                </Typography>
            )}
        </Paper>
    );
};

export default ConnectionForm;
