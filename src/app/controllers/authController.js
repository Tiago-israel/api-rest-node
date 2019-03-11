const express = require('express');
const { create, authenticate, forgotPassword, resetPassword } = require('../services/authService');
const response = require('../models/response');

const router = express.Router();
let notificationList = [];

router.post('/register', async (req, res) => {
    notificationList = [];
    const user = await create(req.body, notificationList);
    return response(notificationList, user, res);
});

router.post('/authenticate', async (req, res) => {
    notificationList = [];
    const user = await authenticate(req.body, notificationList);
    return response(notificationList, { user }, res);
});

router.post('/forgot_password', async (req, res) => {
    notificationList = [];
    await forgotPassword(req.body, notificationList);
    return response(notificationList, undefined, res);
});

router.post('/reset_password', async (req, res) => {
    notificationList = [];
    await resetPassword(req.body, notificationList);
    return response(notificationList, undefined, res);
})


module.exports = app => app.use('/auth', router);