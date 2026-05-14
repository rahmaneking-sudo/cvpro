import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { generateToken as generateJWT } from '../middleware/auth.js';
import { generateToken, sanitizeUser } from '../utils/helpers.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/emailService.js';

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = generateToken();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        verifyToken,
        provider: 'email',
        emailVerified: process.env.NODE_ENV !== 'production', // Auto-verify in dev
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verifyToken);
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
      // Don't block registration if email fails in dev
    }

    const token = generateJWT(user.id, user.email);

    res.status(201).json({
      message: 'Compte créé. Vérifiez votre email pour activer votre compte.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter', needsVerification: true });
    }

    const token = generateJWT(user.id, user.email);

    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/auth/verify/:token
export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Token de vérification invalide' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null },
    });

    res.json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/auth/resend-verification
export async function resendVerification(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.json({ message: 'Si un compte existe, un email a été envoyé.' });
    if (user.emailVerified) return res.json({ message: 'Email déjà vérifié.' });

    const verifyToken = generateToken();
    await prisma.user.update({ where: { id: user.id }, data: { verifyToken } });
    await sendVerificationEmail(email, verifyToken);

    res.json({ message: 'Email de vérification renvoyé.' });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/auth/forgot-password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user) return res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' });

    const resetToken = generateToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires },
    });

    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/auth/reset-password
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetExpires: null },
    });

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/auth/google
export async function googleAuth(req, res) {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Existing user — update Google info if needed
      if (!user.avatar && avatar) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar, emailVerified: true },
        });
      }
    } else {
      // Create new user from Google
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          provider: 'google',
          emailVerified: true, // Google accounts are pre-verified
        },
      });
    }

    const token = generateJWT(user.id, user.email);

    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/auth/profile
export async function updateProfile(req, res) {
  try {
    const { name, username, locale } = req.body;

    // Check username uniqueness
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: req.userId } },
      });
      if (existing) {
        return res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username }),
        ...(locale !== undefined && { locale }),
      },
    });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
