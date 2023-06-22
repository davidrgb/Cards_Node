const express = require('express');
const path = require('path');

const app = express();

const port = 3010;

app.use(express.static(path.resolve(__dirname, '../cards/build')));
app.use(express.static('public'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test message.' });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../cards', 'build', 'index.html'));
});

app.listen(port, () =>
  console.log(`Cards listening on port ${port}!`),
);