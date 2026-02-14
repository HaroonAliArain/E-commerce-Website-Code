const transporter = require("../config/email");

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error("Email Error:", error.message);
    }
};

module.exports = sendEmail;
