const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:123@qwe@cluster0-go1k0.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;

