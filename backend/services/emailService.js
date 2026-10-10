const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.MAIL_PORT) || 587;

  const user = (process.env.MAIL_USERNAME || "").trim();

  const pass = (process.env.MAIL_PASSWORD || "")
    .trim()
    .replace(/\s+/g, "");

  if (!user || !pass) {
    const error = new Error(
      "SMTP email credentials are missing. Check MAIL_USERNAME and MAIL_PASSWORD in .env"
    );

    error.code = "SMTP_NOT_CONFIGURED";

    throw error;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,

    auth: {
      user,
      pass,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });
}

const sendOTPEmail = async (email, otp) => {
  const transporter = getTransporter();

  const from =
    process.env.MAIL_FROM ||
    `"Campus Canteen" <${process.env.MAIL_USERNAME}>`;

  const mailOptions = {
    from,
    to: email,

    subject:
      "Campus Canteen - Password Reset Verification Code",

    text: `Campus Canteen

Password Reset Request

We received a request to reset your Campus Canteen account password.

Your verification code is:

${otp}

This code will expire in 5 minutes.

If you did not request a password reset, please ignore this email.

Thank you,
Campus Canteen Team`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#f4f7f5;
        font-family:Arial,Helvetica,sans-serif;
      ">

        <div style="
          padding:40px 20px;
        ">

          <div style="
            max-width:520px;
            margin:0 auto;
            background:#ffffff;
            border-radius:16px;
            padding:32px;
            box-shadow:0 4px 20px rgba(0,0,0,0.08);
          ">

            <div style="
              text-align:center;
              margin-bottom:25px;
            ">

              <div style="
                display:inline-block;
                background:#073B30;
                color:#F5B800;
                padding:12px 20px;
                border-radius:12px;
                font-size:22px;
                font-weight:bold;
              ">
                Campus Canteen
              </div>

            </div>

            <h2 style="
              color:#073B30;
              text-align:center;
              margin-bottom:15px;
            ">
              Password Reset
            </h2>

            <p style="
              color:#444444;
              font-size:15px;
              line-height:1.6;
            ">
              We received a request to reset your Campus Canteen
              account password.
            </p>

            <p style="
              color:#444444;
              font-size:15px;
              line-height:1.6;
            ">
              Your verification code is:
            </p>

            <div style="
              text-align:center;
              margin:25px 0;
            ">

              <span style="
                display:inline-block;
                background:#f4f7f5;
                border:2px solid #F5B800;
                color:#073B30;
                padding:18px 28px;
                border-radius:12px;
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
              ">
                ${otp}
              </span>

            </div>

            <p style="
              color:#555555;
              font-size:14px;
              line-height:1.6;
              text-align:center;
            ">
              This verification code will expire in
              <strong>5 minutes</strong>.
            </p>

            <div style="
              margin-top:25px;
              padding:15px;
              background:#fff8df;
              border-radius:10px;
              border-left:4px solid #F5B800;
            ">

              <p style="
                margin:0;
                color:#555555;
                font-size:13px;
                line-height:1.5;
              ">
                If you did not request a password reset,
                you can safely ignore this email.
              </p>

            </div>

            <hr style="
              border:none;
              border-top:1px solid #eeeeee;
              margin:30px 0 20px;
            ">

            <p style="
              margin:0;
              text-align:center;
              color:#999999;
              font-size:12px;
            ">
              Campus Canteen Management System
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("[email] OTP email sent successfully");
  console.log("[email] messageId:", info.messageId);
  console.log("[email] accepted:", info.accepted);
  console.log("[email] rejected:", info.rejected);
  console.log("[email] response:", info.response);

  return info;
};

const sendPasswordResetOtpEmail = async (
  email,
  otp,
  expiresMinutes = 5
) => {
  return sendOTPEmail(email, otp);
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetOtpEmail,
};