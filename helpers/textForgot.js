const resetPasswordMessage = (name, randomPassword) => `
  <html>
    <body>
      <h2>Password Reset</h2>
      <p>Hello ${name},</p>
      <p>Your password has been reset successfully.</p>
      <p>Your new password is: <strong>${randomPassword}</strong></p>
      <p>Please login with this password and change it immediately after login.</p>
      <p>Best regards,<br/>Taufiq - Phincon</p>
    </body>
  </html>
`;

module.exports = resetPasswordMessage;
