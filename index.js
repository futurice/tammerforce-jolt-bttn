const app = require('./app')();

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Express server listening on port ${PORT}`);
});
