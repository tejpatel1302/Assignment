const express = require('express');
const rateLimit = require('express-rate-limit');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const connection  = require('./config/postgresql');
const app = express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, 
	max: 30, 
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

app.use('/', apiRoutes);
connection()
app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

