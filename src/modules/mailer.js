const nodemailer = require('nodemailer');
const path = require('path');
const mailConfig = require('../config/mail.json');
const handlebars = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport(mailConfig);

transport.use('compile', handlebars({
    viewEngine: {
        partialsDir:path.resolve('./src/resources/mail/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
}));

module.exports = transport;