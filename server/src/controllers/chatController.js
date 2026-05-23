import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get the user's active chat session or create one
export async function getSession(req, res) {
  try {
    const userId = req.user.id;

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
    const userId = req.user.id;
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

    // Update session updatedAt to bring it to the top of the admin list
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() }
    });

    res.json({ success: true, message });
  } catch (error) {
    console.error('Chat sendMessage Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
}
