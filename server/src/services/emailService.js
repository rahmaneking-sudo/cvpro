import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_NAME = process.env.APP_NAME || 'CV Pro';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

function emailTemplate(title, content, buttonText, buttonUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:16px;border:1px solid rgba(201,169,110,0.15);overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:40px 40px 20px;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#C9A96E,#D4B878);display:inline-block;text-align:center;line-height:40px;color:#0A0A0A;font-weight:bold;font-size:18px;">C</div>
            <span style="font-size:22px;font-weight:bold;color:#F5F0EB;">CV <span style="color:#C9A96E;">Pro</span></span>
          </div>
        </td></tr>
        <!-- Title -->
        <tr><td style="padding:10px 40px 5px;text-align:center;">
          <h1 style="margin:0;font-size:24px;color:#F5F0EB;font-weight:700;">${title}</h1>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:20px 40px;text-align:center;color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;">
          ${content}
        </td></tr>
        <!-- Button -->
        ${buttonText ? `
        <tr><td style="padding:10px 40px 30px;text-align:center;">
          <a href="${buttonUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#C9A96E,#D4B878);color:#0A0A0A;font-weight:600;font-size:15px;text-decoration:none;border-radius:50px;">${buttonText}</a>
        </td></tr>` : ''}
        <!-- Footer -->
        <tr><td style="padding:20px 40px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(email, token) {
  const url = `${APP_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${APP_NAME} — Vérifiez votre adresse email`,
    html: emailTemplate(
      'Vérifiez votre email',
      `<p>Bienvenue sur ${APP_NAME} ! Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>
       <p style="margin-top:15px;font-size:13px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>`,
      'Vérifier mon email',
      url
    ),
  });
}

export async function sendResetPasswordEmail(email, token) {
  const url = `${APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${APP_NAME} — Réinitialisation de mot de passe`,
    html: emailTemplate(
      'Réinitialisation de mot de passe',
      `<p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.</p>
       <p style="margin-top:15px;font-size:13px;">Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>`,
      'Réinitialiser mon mot de passe',
      url
    ),
  });
}

export async function sendActivationEmail(email, name) {
  const url = `${APP_URL}/dashboard`;
  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${APP_NAME} — Votre compte a été activé ! 🎉`,
    html: emailTemplate(
      'Compte Activé !',
      `<p>Bonjour ${name || ''},</p>
       <p>Bonne nouvelle ! Votre compte <strong>${APP_NAME}</strong> vient d'être activé par l'administrateur.</p>
       <p>Vous avez maintenant un forfait actif. Vous pouvez dès à présent vous connecter et profiter de tous nos services pour créer un CV et un portfolio exceptionnels.</p>`,
      'Accéder à mon Dashboard',
      url
    ),
  });
}

