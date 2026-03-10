const nodemailer = require("nodemailer");

const sendAssignmentEmail = async (to, jobTitle, companyName, assignmentLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"${companyName}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Assignment for ${jobTitle} Role`,
    html: `
      <h3>Congratulations! 🎉</h3>
      <p>You have been shortlisted for the <b>${jobTitle}</b> role.</p>
      <p>Please complete the assignment using the link below:</p>
      <a href="${assignmentLink}">${assignmentLink}</a>
      <br/><br/>
      <p>Best of luck!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendAssignmentEmail;
