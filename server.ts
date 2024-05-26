import express from 'express';
import bodyParser from 'body-parser';
import setRouter from './src/router';

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
setRouter(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

process.on('SIGINT', function () {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit(0);
});
