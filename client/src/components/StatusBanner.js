import React from 'react';

function StatusBanner({ status, onToggleSqlInjection }) {
  const { sqlInjectionVulnerability } = status;

  return (
    <div className="status-banner-container">
      <div className={`status-banner ${sqlInjectionVulnerability ? 'vulnerable' : 'secure'}`}>
        <div className="status-info">
          <h3>SQL umetanje</h3>
          <p>
            {sqlInjectionVulnerability ? 'UKLJUČENO (NESIGURNO)' : 'ISKLJUČENO (SIGURNO)'}
          </p>
        </div>
        <button onClick={onToggleSqlInjection}>
          Promjeni
        </button>
      </div>
        <p>
            Upute: Kada je ranjivost uključena unijeti npr. <code> admin' OR '1'='1 </code> kao korisničko ime za izvođenje SQL umetanja.
        </p>
    </div>
  );
}

export default StatusBanner;

