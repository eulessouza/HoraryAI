import React, { useState } from 'react';

export default function ApiTest() {
  const [status, setStatus] = useState('idle');
  const [detail, setDetail] = useState(null);

  async function runTest() {
    setStatus('running');
    setDetail(null);
    try {
      const res = await fetch('/api/planets?date=2025-01-01&planet=0');
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      if (!res.ok) {
        setStatus('failed');
        setDetail({ httpStatus: res.status, body: json });
        return;
      }

      const isObject = typeof json === 'object' && json !== null;
      const hasExpected = isObject && (json.date || json.jd || json.longitude || json.planet || json.result);

      if (hasExpected) {
        setStatus('passed');
        setDetail(json);
      } else {
        setStatus('failed');
        setDetail({ message: 'Unexpected response shape', body: json });
      }
    } catch (err) {
      setStatus('error');
      setDetail({ message: err.message });
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, maxWidth: 720 }}>
      <h3 style={{ margin: '0 0 8px 0' }}>API Test</h3>
      <div style={{ fontSize: 13, color: '#444' }}>Endpoint: <code>/api/planets?date=2025-01-01&planet=0</code></div>
      <div style={{ marginTop: 8 }}>
        <button onClick={runTest} style={{ padding: '6px 10px' }}>Run test</button>
      </div>
      <div style={{ marginTop: 10 }}>
        <strong>Status:</strong> {status}
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, background: '#fafafa', padding: 8, borderRadius: 4 }}>{detail ? JSON.stringify(detail, null, 2) : ''}</pre>
    </div>
  );
}
