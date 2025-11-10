import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import StatusBanner from './components/StatusBanner';
import LoginResult from './components/LoginResult';

function App() {
  const [vulnerabilityStatus, setVulnerabilityStatus] = useState({
    sqlInjectionVulnerability: true,
  });
  const [loginResult, setLoginResult] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setVulnerabilityStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleToggleSqlInjection = async () => {
    try {
      const response = await fetch('/api/toggle-sql-injection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setVulnerabilityStatus(prev => ({
        ...prev,
        sqlInjectionVulnerability: data.sqlInjectionVulnerability
      }));
      setLoginResult(null);
    } catch (error) {
      console.error('Error toggling SQL injection:', error);
    }
  };

  const handleLogin = async (username, password) => {
    setLoginResult(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      setLoginResult(data);
    } catch (error) {
      setLoginResult({
        success: false,
        error: error.message
      });
    }
  };

  return (
    <div className="App">
      <div className="container">
        <StatusBanner
          status={vulnerabilityStatus}
          onToggleSqlInjection={handleToggleSqlInjection}
        />

        <div className="main-content">
          <div className="left-panel">
            <LoginForm
              onLogin={handleLogin}
            />
          </div>

          <div className="right-panel">
            {loginResult && <LoginResult result={loginResult} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

