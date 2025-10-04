// server/index.js
const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
