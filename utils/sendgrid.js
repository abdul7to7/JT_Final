require("dotenv").config(); // Make sure to load environment variables from .env file
const sgMail = require("@sendgrid/mail");

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send an email
const sendEmail = async (to, subject, text) => {
  const msg = {
    to: to,
    from: "abdul7to7@gmail.com", // Your verified sender email
    subject: subject,
    text: text,
    html: `<p>${text}</p>`, // Optional: send HTML email
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Export the sendEmail function
module.exports = { sendEmail };
