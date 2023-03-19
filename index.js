const fs = require('fs');
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
const node_cron = require('node-cron');

const { MAIL_SETTINGS } = require('./constants');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const express = require('express');

//Default Middlewares
const app = express();
app.use(express.json())

async function sendMail() {

    // Execute the script file named 'script.bash'
    exec('bash script.bash', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });

    // Wait for 50 seconds before sending the mail
    setTimeout(() => {
        console.log('Sending mail');
        const data = fs.readFileSync('text.txt');
        try
        {
            transporter.sendMail({
            from: MAIL_SETTINGS.auth.user,
            to: '201375@juitsolan.in',
            subject: `Hey user, here's you daily Vulnerability Report for date ${new Date().toDateString()} time ${new Date().toTimeString()}`,
            text: data
            });
        }
        catch(err)
        {
            console.log(err);
        }

        //Delete the file after sending the mail
        fs.unlinkSync('text.txt', (err) => {
            console.log("Deleting File");
            if (err) {
                console.log(err)
            }
        })

    }, 50000);

    console.log("Sending Mail Initiated");
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App is listening at port ${port}`)
})


// Cron job to run the script after every 2 minutes

node_cron.schedule('*/2 * * * *', () => {
    console.log('Running Cron Job');
    sendMail();
});