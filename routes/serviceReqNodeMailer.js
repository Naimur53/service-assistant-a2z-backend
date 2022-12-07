const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post("/", async (req, res) => {



    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "servicea2zweb@gmail.com",
            pass: "servicea2ZTeamB"
        }
    });
    const mailOptions = {
        from: req.body.email,
        to: 'servicea2zweb@gmail.com',
        subject: req.body.name,
        html: `<b>Location: ${req.body.area}</b>
        <br> 
        <b> Email: </b> ${req.body.email}
        <br> 
        <b> Name: </b> ${req.body.name}
        <br> 
        <b> Contact: </b> ${req.body.contact}
        <br> 
        <b> Message: </b> ${req.body.message}`,
    }
    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            res.send("Email could not sent due to error: " + error);
            console.log(error);
            console.log('Error');
        } else {
            res.send("Email has been sent successfully");
            console.log('mail sent');
        }
    })
})

module.exports = router