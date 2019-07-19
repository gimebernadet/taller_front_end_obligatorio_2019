const config = require('./config/properties.json');
const mongoose = require('mongoose');

const app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect(config.database, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Database connected")

        const listener = app.listen(config.port, () => {
            console.log(`Server or start in port ${listener.address().port}`);
        });
    })
    .catch(err => console.log('MongoDB connection error:', err));