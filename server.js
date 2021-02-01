try {
  require('./secrets');
} catch (ex) {
  console.log(ex);
  console.log(
    'if running locally add secrets.js file which sets environment variables for GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET'
  );
}
const { syncAndSeed } = require('./db');
const app = require('./app');

const init = async () => {
  await syncAndSeed();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
