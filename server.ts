import express from 'express';
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import sqlite3 from "sqlite3";

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

interface ProtectedData {
  id: number;
  user_id: number;
  secret: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', 'db', 'data.sqlite');
if (!fs.existsSync(DB_FILE)) {
    console.error('Database missing: run `npm run seed` first.');
    process.exit(1);
}
const db = new sqlite3.Database(DB_FILE);

let sqlInjectionVulnerability: boolean = true;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/api/status', (req, res) => {
  res.json({
    sqlInjectionVulnerability,
  });
});

app.post('/api/toggle-sql-injection', (req, res) => {
  sqlInjectionVulnerability = !sqlInjectionVulnerability;
  res.json({
    sqlInjectionVulnerability,
    message: `SQL Injection vulnerability is now ${sqlInjectionVulnerability ? 'ENABLED' : 'DISABLED'}`
  });
});

function vulnerableLogin(username: string, password: string, res: express.Response) {
  const query = `SELECT * FROM users WHERE username = '${username}' AND password_hash = '${password}'`;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message,
        query: query,
        mode: 'vulnerable'
      });
      return;
    }

    const users = rows as User[];
    if (users && users.length > 0) {
      const userIds = users.map(u => u.id).join(',');
      const dataQuery = `SELECT * FROM protected_data WHERE user_id IN (${userIds})`;

      db.all(dataQuery, [], (err2, dataRows) => {
        if (err2) {
          res.status(500).json({
            success: false,
            error: err2.message,
            query: query,
            dataQuery: dataQuery,
            mode: 'vulnerable'
          });
          return;
        }

        const protectedData = dataRows as ProtectedData[];

        res.json({
          success: true,
          mode: 'vulnerable',
          username: users[0]!.username,
          query: query,
          dataQuery: dataQuery,
          protectedData: protectedData,
          users: users
        });
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        query: query,
        mode: 'vulnerable'
      });
    }
  });
}

function secureLogin(username: string, password: string, res: express.Response) {
  const query = `SELECT * FROM users WHERE username = ? AND password_hash = ?`;

  db.all(query, [username, password], (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message,
        query: query,
        mode: 'secure'
      });
      return;
    }

    const users = rows as User[];
    if (users && users.length > 0) {
      const userId = users[0]!.id;
      const dataQuery = `SELECT * FROM protected_data WHERE user_id = ?`;

      db.all(dataQuery, [userId], (err2, dataRows) => {
        if (err2) {
          res.status(500).json({
            success: false,
            error: err2.message,
            query: query,
            dataQuery: dataQuery,
            mode: 'secure'
          });
          return;
        }

        const protectedData = dataRows as ProtectedData[];

        res.json({
          success: true,
          mode: 'secure',
          username: users[0]!.username,
          query: query,
          queryParams: [username, password],
          dataQuery: dataQuery,
          dataQueryParams: [userId],
          protectedData: protectedData
        });
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        query: query,
        mode: 'secure'
      });
    }
  });
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
    return;
  }

  if (sqlInjectionVulnerability) {
    vulnerableLogin(username, password, res);
  } else {
    secureLogin(username, password, res);
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});