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

// ─── New Subscriber Notification to Creator ────────────────────────────────────
export const sendNewSubscriberEmail = async ({ creatorEmail, creatorName, subscriberName, totalSubscribers }) => {
  const year = new Date().getFullYear();

  const mailOptions = {
    from: `"ALPHA Podcast Platform" <${process.env.EMAIL_USER}>`,
    to: creatorEmail,
    subject: `🎉 ${subscriberName} just subscribed to your channel!`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f0f0f; padding: 40px 0; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">

          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 50%, #c850c0 100%); padding: 50px 30px; text-align: center;">
            <div style="font-size: 52px; margin-bottom: 12px;">🎉</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: 1px;">You Got a New Subscriber!</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 15px; font-weight: 400;">Your channel is growing. Keep creating! 🚀</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 42px 36px;">

            <!-- Greeting -->
            <p style="color: #e0e0e0; font-size: 17px; line-height: 1.7; margin: 0 0 24px;">
              Hey <strong style="color: #ffffff;">${creatorName}</strong>, 👋
            </p>

            <!-- Subscriber Card -->
            <div style="background: linear-gradient(135deg, rgba(255,75,43,0.12) 0%, rgba(255,65,108,0.12) 100%); border: 1px solid rgba(255,75,43,0.3); border-radius: 14px; padding: 24px; margin: 24px 0; text-align: center;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #FF4B2B, #FF416C); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 26px; line-height: 60px; display: block;">👤</span>
              </div>
              <p style="color: #aaaaaa; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 6px;">New Subscriber</p>
              <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">${subscriberName}</h2>
              <p style="color: #888888; font-size: 14px; margin: 8px 0 0;">just hit that Subscribe button on your channel ❤️</p>
            </div>

            <!-- Subscriber Count Badge -->
            <div style="background-color: #242424; border-radius: 12px; padding: 18px 24px; margin: 20px 0; display: flex; align-items: center; text-align: center;">
              <div style="width: 100%;">
                <p style="color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Total Subscribers</p>
                <p style="color: #FF416C; font-size: 36px; font-weight: 800; margin: 0; letter-spacing: 2px;">${totalSubscribers.toLocaleString()}</p>
              </div>
            </div>

            <!-- Message -->
            <p style="color: #bbbbbb; font-size: 16px; line-height: 1.8; margin: 24px 0;">
              Every subscriber represents someone who believes in your voice and your content.
              <strong style="color: #ffffff;">${subscriberName}</strong> chose <em>you</em> out of everyone on ALPHA — that's something truly special. 🌟
            </p>

            <p style="color: #bbbbbb; font-size: 16px; line-height: 1.8; margin: 0 0 32px;">
              Keep creating authentic, compelling content and your community will continue to grow. You're building something amazing.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 0;">
              <a href="https://alpha-podcast.vercel.app/profile"
                 style="background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 700; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 8px 24px rgba(255,65,108,0.4);">
                View Your Channel →
              </a>
            </div>
          </div>

          <!-- Divider -->
          <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent); margin: 0 30px;"></div>

          <!-- Footer -->
          <div style="padding: 28px 36px; text-align: center;">
            <p style="color: #444444; font-size: 13px; margin: 0 0 6px;">
              You're receiving this because you're a creator on
              <strong style="color: #FF416C;">ALPHA Podcast Platform</strong>
            </p>
            <p style="color: #333333; font-size: 12px; margin: 0;">
              © ${year} ALPHA Podcast Platform. Made with ❤️ for creators.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] New subscriber notification sent to ${creatorEmail}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send subscriber notification:', error.message);
    // Don't throw — email failure should not break the subscribe action
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