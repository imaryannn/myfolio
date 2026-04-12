module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  const fs = require('fs');
  const path = require('path');
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  res.send(html);
};
