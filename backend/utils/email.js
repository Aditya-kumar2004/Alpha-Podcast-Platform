import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Prepare for local development environments where certs might differ
    rejectUnauthorized: false
  }
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code - ALPHA Podcast Platform',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%); padding: 40px 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">ALPHA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px; font-weight: 500;">PODCAST PLATFORM</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px; font-weight: 600; text-align: center;">Welcome to the Future of Audio! 🎧</h2>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-top: 20px; text-align: center;">
              Hello there,
            </p>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">
              Thank you for joining <strong>ALPHA Podcast Platform</strong>. You are just one step away from unlocking India's most curated collection of podcasts, featuring top creators and exclusive content.
            </p>

            <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">
              Please enter the code below to verify your email address and activate your premium experience:
            </p>

            <!-- OTP Box -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; border: 2px dashed #e0e0e0;">
              <span style="display: block; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Verification Code</span>
              <h1 style="color: #FF416C; font-size: 42px; font-weight: 800; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>

            <p style="color: #888888; font-size: 14px; text-align: center;">
              This code will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="color: #888888; font-size: 12px; margin: 0;">
              Need help? Contact us at <a href="mailto:hello@alphapodcast.com" style="color: #FF416C; text-decoration: none;">hello@alphapodcast.com</a>
            </p>
            <p style="color: #cccccc; font-size: 12px; margin: 10px 0 0;">
              © ${new Date().getFullYear()} ALPHA Podcast Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const sendSubscriptionEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to ALPHA Podcast Platform! 🎧',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%); padding: 40px 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">ALPHA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px; font-weight: 500;">PODCAST PLATFORM</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px; font-weight: 600; text-align: center;">You're on the list! ✅</h2>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-top: 20px; text-align: center;">
              Hi there,
            </p>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">
              Thanks for subscribing to our newsletter! You'll now be the first to know about:
            </p>

            <ul style="color: #555555; font-size: 16px; line-height: 1.8; margin: 20px auto; max-width: 400px; list-style-position: inside;">
                <li>🔥 New episodes from top creators</li>
                <li>🚀 Exclusive content and interviews</li>
                <li>🎁 Special community perks</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="color: #cccccc; font-size: 12px; margin: 10px 0 0;">
              © ${new Date().getFullYear()} ALPHA Podcast Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Subscription Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'adityakuma876@gmail.com', // Admin email
    replyTo: email, // Reply to the user who sent the message
    subject: `Contact Form: ${subject} - ${name}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%); padding: 30px 0; text-align: center;">
            <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">New Contact Message</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 20px;">
                <h3 style="color: #1a1a1a; margin: 0 0 10px 0;">Sender Details</h3>
                <p style="color: #555; margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="color: #555; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="color: #555; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div>
                <h3 style="color: #1a1a1a; margin: 0 0 15px 0;">Message</h3>
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; color: #333; line-height: 1.6; border-left: 4px solid #FF416C;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="color: #888888; font-size: 12px; margin: 0;">
              Sent from ALPHA Podcast Platform
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact Email sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendDeleteOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Deletion Verification Code - ALPHA Podcast Platform',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          <div style="background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%); padding: 40px 0; text-align: center;">
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px; font-weight: 600;">Account Deletion Request</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">
              You have requested to delete your account. This action is irreversible. <br>
              Please enter the code below to confirm this action:
            </p>
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; border: 2px dashed #e0e0e0;">
              <h1 style="color: #FF416C; font-size: 42px; font-weight: 800; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Delete OTP Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const sendAccountDeletedNotification = async (user, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'adityakuma876@gmail.com',
    subject: `Account Deleted: ${user.username}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          <div style="padding: 40px 30px;">
            <h2 style="color: #d32f2f; margin-top: 0;">User Account Deleted</h2>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Reason for Deletion:</strong></p>
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #d32f2f;">${reason}</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin Notification Email sent successfully');
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
};