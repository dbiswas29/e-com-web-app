'use client';

import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log('Starting API test...');
    setStatus('Making API call...');
    
    fetch('http://localhost:3001/api/products')
      .then(response => {
        console.log('Response received:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        setStatus('Success!');
        setData(data);
      })
      .catch(error => {
        console.error('Error:', error);
        setStatus(`Error: ${error.message}`);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Test</h1>
      <p>Status: {status}</p>
      {data && (
        <div>
          <p>Products count: {data.data?.length || 0}</p>
          <pre className="bg-gray-100 p-4 text-sm overflow-auto">
            {JSON.stringify(data, null, 2).substring(0, 500)}...
          </pre>
        </div>
      )}
    </div>
  );
}
