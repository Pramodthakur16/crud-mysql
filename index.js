import express from 'express';

import mysql from 'mysql2/promise';

const app = express();
const port = 3001;

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your-database-username',
    password: 'your-password',
    database: 'user',
    connectionLimit: 10
});

app.use(express.json());

// Create a user
app.post('/users', async (req, res) => {
    try {
      const { name, email } = req.body;
      const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
      res.json({ id: result.insertId, name, email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Read all users
  app.get('/users', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Read a user by ID
  app.get('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Update a user by ID
  app.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const [result] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ id: parseInt(id), name, email });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete a user by ID
  app.delete('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})