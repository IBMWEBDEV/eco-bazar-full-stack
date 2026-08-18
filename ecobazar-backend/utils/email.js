const nodemailer = require("nodemailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "ibrahim17oc23@gmail.com",
        pass: process.env.EMAIL_PASS || "tiddaqksawrefled",
    },
});


// ================= VERIFY EMAIL =================

const mailVerification = async(token, email, username = "User") => {

    const verifyLink = `${FRONTEND_URL}/verify-email/${token}`;

    try {

        await transporter.sendMail({

            from: `"EcoBazar" <${process.env.EMAIL_USER || "ibrahim17oc23@gmail.com"}>`,

            to: email,

            subject: "Verify Your Email",

            html: `
            <div style="font-family:Arial;background:#f4f4f4;padding:40px">

                <div style="max-width:600px;background:#fff;margin:auto;border-radius:10px;overflow:hidden">

                    <div style="background:#00B207;padding:30px;text-align:center">
                        <h1 style="color:#fff;margin:0">EcoBazar</h1>
                        <p style="color:#fff">Fresh Grocery & Organic Food</p>
                    </div>

                    <div style="padding:40px">

                        <h2>Verify Your Email</h2>

                        <p>Hello <b>${username}</b>,</p>

                        <p>
                        Thank you for creating an EcoBazar account.
                        Please verify your email.
                        </p>

                        <p style="text-align:center;margin:40px 0">

                            <a
                                href="${verifyLink}"
                                style="
                                background:#00B207;
                                color:white;
                                text-decoration:none;
                                padding:15px 35px;
                                border-radius:8px;
                                display:inline-block;
                                ">
                                Verify Email
                            </a>

                        </p>

                        <p>
                        Or copy this link:
                        </p>

                        <p style="word-break:break-all;color:#00B207">
                        ${verifyLink}
                        </p>

                    </div>

                </div>

            </div>
            `

        });

        console.log("Verification Email Sent");

    } catch (err) {

        console.log(err);

    }

};



// ================= RESET PASSWORD =================

const resetPasswordMail = async(token, email, username = "User") => {

    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

    try {

        await transporter.sendMail({

            from: `"EcoBazar" <${process.env.EMAIL_USER || "ibrahim17oc23@gmail.com"}>`,

            to: email,

            subject: "Reset Password",

            html: `
            <div style="font-family:Arial;background:#f4f4f4;padding:40px">

                <div style="max-width:600px;background:#fff;margin:auto;border-radius:10px;overflow:hidden">

                    <div style="background:#00B207;padding:30px;text-align:center">
                        <h1 style="color:#fff;margin:0">EcoBazar</h1>
                        <p style="color:#fff">Fresh Grocery & Organic Food</p>
                    </div>

                    <div style="padding:40px">

                        <h2>Reset Password</h2>

                        <p>Hello <b>${username}</b>,</p>

                        <p>
                        We received a request to reset your password.
                        </p>

                        <p style="text-align:center;margin:40px 0">

                            <a
                                href="${resetLink}"
                                style="
                                background:#00B207;
                                color:white;
                                text-decoration:none;
                                padding:15px 35px;
                                border-radius:8px;
                                display:inline-block;
                                ">
                                Reset Password
                            </a>

                        </p>

                        <p>
                        Or copy this link:
                        </p>

                        <p style="word-break:break-all;color:#00B207">
                        ${resetLink}
                        </p>

                        <p>
                        This link expires in 15 minutes.
                        </p>

                    </div>

                </div>

            </div>
            `

        });

        console.log("Reset Password Email Sent");

    } catch (err) {

        console.log(err);

    }

};

module.exports = {
    mailVerification,
    resetPasswordMail,
};