import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get the user's active chat session or create one
export async function getSession(req, res) {
  try {
    const userId = req.userId;

    let session = await prisma.chatSession.findFirst({
      where: { userId, status: 'open' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          status: 'open'
        },
        include: {
          messages: true
        }
      });
    }

    res.json({ success: true, session });
  } catch (error) {
    console.error('Chat getSession Error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la session de chat.' });
  }
}

// Send a message as a user
export async function sendMessage(req, res) {
  try {
    const userId = req.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
    }

    let session = await prisma.chatSession.findFirst({
      where: { userId, status: 'open' }
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, status: 'open' }
      });
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'user',
        content: content.trim(),
        isRead: false
      }
    });

    // Count user messages to see if it's the very first message
    const userMessageCount = await prisma.chatMessage.count({
      where: { sessionId: session.id, sender: 'user' }
    });

    let autoReplyMessage = null;
    if (userMessageCount === 1) {
      autoReplyMessage = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: 'admin',
          content: "Bonjour et bienvenue sur Sama CV Pro ! 👋 Nous avons bien reçu votre requête. Un membre de notre équipe va vous assister dans un instant. Merci de patienter.",
          isRead: false
        }
      });
    }

    // Update session updatedAt to bring it to the top of the admin list
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() }
    });

    res.json({ success: true, message, autoReplyMessage });
  } catch (error) {
    console.error('Chat sendMessage Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
}

// Get unread messages count
export async function getUnreadCount(req, res) {
  try {
    const userId = req.userId;
    const session = await prisma.chatSession.findFirst({
      where: { userId, status: 'open' }
    });

    if (!session) {
      return res.json({ success: true, count: 0 });
    }

    const count = await prisma.chatMessage.count({
      where: { 
        sessionId: session.id, 
        sender: 'admin',
        isRead: false 
      }
    });

    res.json({ success: true, count });
  } catch (error) {
    console.error('Chat getUnreadCount Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Mark session messages as read
export async function markAsRead(req, res) {
  try {
    const userId = req.userId;
    const session = await prisma.chatSession.findFirst({
      where: { userId, status: 'open' }
    });

    if (session) {
      await prisma.chatMessage.updateMany({
        where: { 
          sessionId: session.id, 
          sender: 'admin', 
          isRead: false 
        },
        data: { isRead: true }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Chat markAsRead Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
