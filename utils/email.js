/* eslint-disable no-undef */

const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
    this.pin = user.pin; // Include PIN for email verification
    this.from = `YourApp Admin <${process.env.EMAIL_FROM}>`;
  }

  // Transport configuration
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Configure production email service (e.g., SendGrid, SES)
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Development email configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // General email sending function
  async send(template, subject, data = {}) {
    const html = pug.renderFile(`${__dirname}/../view/email/${template}.pug`, {
      name: this.name,
      pin: this.pin,
      subject,
      ...data, // Include additional dynamic data
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // Send verification PIN email
  async sendVerificationPin() {
    await this.send("verificationPin", "Your Verification PIN");
  }

  // Send Forget Password PIN email
  async sendPasswordResetPin() {
    await this.send("passwordResetPin", "Your Forget Password PIN");
  }

  // Example: Send welcome email
  async sendWelcome() {
    await this.send("welcome", "Welcome to YourApp!");
  }
}

module.exports = Email;
