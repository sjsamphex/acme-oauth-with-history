const express = require('express');
const app = express();

app.use(express.json());
app.engine('html', require('ejs').renderFile);

const {
  models: { User },
} = require('./db');
const path = require('path');

app.get('/', (req, res) =>
  res.render(path.join(__dirname, 'index.html'), {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  })
);

app.get('/api/auth', async (req, res, next) => {
  try {
    res.send(await User.byToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.get('/github/callback', async (req, res, next) => {
  try {
    const token = await User.authenticate(req.query.code);
    res.send(`
      <html>
       <body>
       <script>
        window.localStorage.setItem('token', '${token}');
        window.document.location = '/';
       </script>
        </body>
      </html>
    `);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
