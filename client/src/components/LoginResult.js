import React from 'react';

function LoginResult({ result }) {
  const { success, mode, username, query, protectedData } = result;

  if (!success) {
    return (
      <div className="result-container error">
        <h2>Prijava neuspješna</h2>
        <p>{'Netočni podaci'}</p>
        <div className="query-display">
          <h3>SQL upit:</h3>
          <pre>{query}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className={`result-container success ${mode}`}>
      <h2>Prijava uspješna</h2>
      <div>
        {mode === 'vulnerable' ? 'NESIGURNO' : 'Sigurno'}
      </div>
      
      <div className="user-info">
        <p>Prijavljeni korisnik: <strong>{username}</strong></p>
      </div>

      <div className="query-display">
        <h3>Izvršen SQL upit:</h3>
        <pre>{query}</pre>
      </div>

      <div className="protected-data">
        <h3>Dohvaćeni zaštićeni podaci:</h3>
        <pre>{JSON.stringify(protectedData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default LoginResult;

