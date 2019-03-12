const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const create = async (user, notificationList = []) => {
    const { email } = user;
    if (await User.findOne({ email })) {
        notificationList.push({ error: 'Email já cadastrado!' });
        return;
    }
    try {
        const userResponse = await User.create(user);
        userResponse.password = undefined;
        return { user: userResponse, token: generateToken({ id: userResponse.id }) };
    } catch{
        notificationList.push({ error: 'Falha ao salvar o usuário.' });
        return undefined;
    }
}

const authenticate = async (login, notificationList = []) => {
    const { email, password } = login;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        notificationList.push({ error: 'Usuário não encontrado' });
        return;
    }
    if (!await bcrypt.compare(password, user.password)) {
        notificationList.push({ error: 'Senha inválida.' });
        return;
    }
    return { user, token: generateToken({ id: user.id }) };
}

const forgotPassword = async ({ email }, notificationList = []) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            notificationList.push({ error: 'Usuário não encontrado' });
            return;
        }
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });
        mailer.sendMail({
            to: email,
            from: 'tiagoisrael77@hotmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if (err)
                notificationList.push({ error: 'não foi possível enviar o email.' });
        })
    } catch (e) {
        notificationList.push({ error: 'Erro ao recuperar a senha, tente novamente.' });
    }
}

const resetPassword = async ({ email, token, password }, notificationList = []) => {
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
    if (!user) {
        notificationList.push({ error: 'Usuário não encontrado' });
        return;
    }
    if (token !== user.passwordResetToken) {
        notificationList.push({ error: 'Token inválido' });
        return;
    }
    const now = new Date();
    if (now > user.passwordResetExpires) {
        notificationList.push({ error: 'Token expirado, gere um novo.' });
        return;
    }
    user.password = password;
    await user.save();
}

const generateToken = (params) => {
    return jwt.sign({ id: params.id }, authConfig.secret, {
        expiresIn: 86400
    });
}

module.exports = { create, authenticate, forgotPassword, resetPassword };
