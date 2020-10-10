const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const winston = require('winston')
const consoleTransport = new winston.transports.Console()
const myWinstonOptions = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions)

require('./config/database'); 
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended : false
}));
app.use(cors());
require('./routes/route')(app)

function logRequest(req, res, next) {
    logger.info(req.url)
    next()
}
app.use(logRequest)

function logError(err, req, res, next) {
    logger.error(err)
    next()
}
app.use(logError)

app.listen(PORT, () => {
    console.log('Express service started on port 3000.')
})