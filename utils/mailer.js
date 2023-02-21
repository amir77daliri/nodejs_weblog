const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


const transporterDetails = smtpTransport({
    host: "",
    port: "",
    secure: true,
    auth: {
        user: "",
        pass: ""
    },
    tls: {
        rejectUnauthorized: false,
    }
});

const transporter = nodeMailer.createTransport(transporterDetails);

const options = {
    from: "",
    to: "",
    subject: "subject",
    text: "Simple Text"
}

transporter.sendMail(options, (err, info) => {
    if(err) return console.log(err)
    console.log(info);
})