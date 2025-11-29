export const EMAIL_VERIFY_TEMPLATE = (verifyLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; padding:30px;">

    <h2 style="text-align:center; color:#333;">Verify Your Email</h2>

    <p style="font-size:15px; color:#555;">
      Hi,
      <br><br>
      Thank you for registering! Please verify your email to continue.
    </p>

    <div style="text-align:center; margin-top:30px;">
      <a href="${verifyLink}"
         style="background:#4a90e2; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; font-size:16px;">
         Verify Email
      </a>
    </div>

    <p style="font-size:14px; color:#777; margin-top:25px;">
      If you didn’t request this, you can safely ignore this email.
    </p>

  </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = (resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Reset</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; padding:30px;">

    <h2 style="text-align:center; color:#333;">Reset Your Password</h2>

    <p style="font-size:15px; color:#555;">
      We received a request to reset your password.
      Click the button below to choose a new password.
    </p>

    <div style="text-align:center; margin-top:30px;">
      <a href="${resetLink}"
         style="background:#e94e77; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; font-size:16px;">
         Reset Password
      </a>
    </div>

    <p style="font-size:14px; color:#777; margin-top:25px;">
      If you didn’t request this, please ignore this email.
    </p>

  </div>
</body>
</html>
`;
