import React, { useState, useEffect } from 'react';
import './App.css';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'email', headerName: 'Email', width: 150 },
  { field: 'emailContent', headerName: 'Content', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
];
function App() {
  const [rows, setRows] = useState(null);
  const [email, setEmail] = useState('')

  useEffect(() => {
    // TODO: error handling
    fetch('/api/emails').then(res => res.json()).then(emails => setRows(Object.values(emails)))
  }, []);

  const sendEmail = () => {
    fetch('/api/test', {
      method: 'POST',
      body: JSON.stringify({ emailAddress: email })
    })
  }

  return (
    <div >
      {rows === null ? <h1>loading...</h1> :
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      }
      <div className='form'>
        <form onSubmit={sendEmail}>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type='submit' text='click' />
        </form>
      </div>
    </div>
  );
}

export default App;
