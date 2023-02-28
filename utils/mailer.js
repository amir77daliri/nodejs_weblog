const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


// ? config your own email options
const transporterDetails = smtpTransport({
    host: "",
    port: 465,
    secure: true,
    auth: {
        user: "",
        pass: ""
    },
    tls: {
        rejectUnauthorized: false,
    }
});



exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(transporterDetails);
    transporter.sendMail({
        from: "",
        to: email,
        subject,
        html: `<h1>سلام ${fullname}</h1> 
               <p>${message}</p>
            `
    },(err, info) => {
        if(err) return console.log(err)
        console.log(info)
    })
}