const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');

const {
  AUTH_TOKEN,
  FEED_API,
  FLOWDOCK_URL,
  FLOWDOCK_FLOW_TOKEN,
  FLOWDOCK_THREAD_ID,
} = process.env;

module.exports = () => {
  const app = express();

  // Middleware.
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors());

  // Routes.
  app.post('/', (req, res) => {
    const { token } = req.body;
    if (token !== AUTH_TOKEN) {
      return res.sendStatus(401);
    }

    return axios.get(FEED_API)
    .then((response) => {
      const thisMonth = new Date().toISOString().substr(0, 7);
      const events = response.data.events;
      const totalCount = events.length;
      const monthlyCount = events.filter(
        event => new Date(event.local_time).toISOString().substr(0, 7) === thisMonth
      ).length;

      const content = `Looks like someone has just been Jolted! ${monthlyCount} Jolts this month, ${totalCount} in total.`;

      return axios.post(FLOWDOCK_URL, {
        flow_token: FLOWDOCK_FLOW_TOKEN,
        event: 'message',
        content,
        thread_id: FLOWDOCK_THREAD_ID,
      });
    })
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(err.response.status || 500));
  });

  return app;
};
