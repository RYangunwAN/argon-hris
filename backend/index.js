const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Argon HRIS backend');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
