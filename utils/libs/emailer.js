const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
    }
});

module.exports = {
    SendVerification: async (data) => {
        try {
            const info = await transporter.sendMail({
                from: 'Finance Tracker Web <finance_super_tracker@outlook.com>',
                to: data.email,
                subject: 'Please use the following verification code to complete your registration process.',
                text: 'Automatic mailer',
                html: `<h2>Your Verification Code:</h2><h3>${data.code}</h3>`
            });

            console.log('Mensaje enviado:', info.messageId);

        } catch (error) {
            console.error(error);
        }
    },
    SendRecovery: async (data) => {
        try {
            const info = await transporter.sendMail({
                from: 'Finance Tracker Web <finance_super_tracker@outlook.com>',
                to: data.email,
                subject: 'YOUR PASSWORD RECOVERY CODE!!!',
                text: 'Automatic mailer',
                html: `<h2>Your Recovery Code:</h2><h3>${data.code}</h3>`
            });

            console.log('Mensaje enviado:', info.messageId);

        } catch (error) {
            console.error(error);
        }
    },
    SendNotification: async (data) => {
        try {
            const info = await transporter.sendMail({
                from: 'Finance Tracker Web <finance_super_tracker@outlook.com>',
                to: data.email,
                subject: 'Transaction Notification!!',
                text: 'Automatic mailer',
                html: (data.quantity > 0) ?
                    `<h2>New Transacion on your Objective!!!</h2><h3>You have added ${data.quantity} to your ${data.goal} goal</h3>` :
                    `<h2>New Transacion on your Objective</h2><h3>You have removed ${Math.abs(data.quantity)} from your ${data.goal} goal</h3>` ,
            });

            console.log('Mensaje enviado:', info.messageId);

        } catch (error) {
            console.error(error);
        }
    }

};
