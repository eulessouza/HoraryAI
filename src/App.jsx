import React from 'react';
import Home from './pages/Home';
import ApiTest from './components/ApiTest';

export default function App() {
  return (
    <div>
      <Home />
      <div style={{ padding: 12 }}>
        <ApiTest />
      </div>
    </div>
  );
}
