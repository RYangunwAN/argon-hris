const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
