const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/testdemoproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(() => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})