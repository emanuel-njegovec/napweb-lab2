import React, { useState } from 'react';

function LoginForm({ onLogin, currentSession }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-form-container">
      {currentSession && (
        <div className="current-session">
          <h3>Trenutna sjednica</h3>
          <p><strong>Korisnik:</strong> {currentSession.username}</p>
          <p><strong>ID sjednice:</strong>{currentSession.sessionId}</p>
          <p><strong>Tip:</strong> {currentSession.sessionType === 'predictable' ? 'Nesiguran' : 'Siguran'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Lozinka:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">
            Prijava
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

