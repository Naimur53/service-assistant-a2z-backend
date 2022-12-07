
var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')

router.post("/", async (req, res) => {



    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "servicea2zweb@gmail.com",
            pass: "servicea2ZTeamB"
        }
    });
    var mailOptions = {
        from: req.body.email,
        to: 'servicea2zweb@gmail.com',
        subject: req.body.name,
        html: `<b>Name: ${req.body.name}</b>
        <br> 
        <b> Email: </b> ${req.body.email}
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