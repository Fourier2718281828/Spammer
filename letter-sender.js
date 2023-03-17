const nodemailer = require('nodemailer');
const mailService = 'gmail';

async function sendLetter(myEmail, myPassword, toEmail, title, text)
{
    console.log("myEmail", myEmail);
    console.log("myPassword", myPassword);
    console.log("toEmail", toEmail);
    console.log("title", title);
    console.log("text", text);

    let transporter = nodemailer.createTransport({
        service: mailService,
        auth: {
            user: myEmail,
            pass: myPassword
        }
    });
    
    const mailOptions = {
        from: myEmail,
        to: toEmail,
        subject: title,
        text: text
    };
    
    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendLetter,
};

// sendLetter(
//     "gogi.vasyil@gmail.com",
//     "gdqhujktksttvfbz",
//     "non-linear@ukr.net",
//     "gogi", "You're vasyil."
// );
//rqgsdagsdfb 