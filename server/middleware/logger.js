const morgan = require("morgan");

// Custom token: response time color-coded
morgan.token("status-colored", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // red
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // yellow
  if (status >= 200) return `\x1b[32m${status}\x1b[0m`; // green
  return status;
});

const devFormat =
  ":method :url :status-colored :response-time ms - :res[content-length]";

const logger =
  process.env.NODE_ENV === "development"
    ? morgan(devFormat)
    : morgan("combined");

module.exports = logger;