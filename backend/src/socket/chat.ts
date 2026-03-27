import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { AuthPayload } from '../middleware/auth';

const prisma = new PrismaClient();

export function setupSocketHandlers(io: Server): void {
  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token gerekli'));
    }

    try {
      const payload = jwt.verify(
        token,
        config.JWT_SECRET
      ) as AuthPayload;
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Gecersiz token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.userId;
    socket.join(`user:${userId}`);

    socket.on(
      'join_conversation',
      (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
      }
    );

    socket.on(
      'send_message',
      async (data: {
        conversationId: string;
        content: string;
        receiverId: string;
      }) => {
        const message = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderId: userId,
            receiverId: data.receiverId,
            content: data.content,
          },
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        });

        io.to(`conversation:${data.conversationId}`)
          .emit('new_message', message);

        // Aliciya bildirim
        io.to(`user:${data.receiverId}`)
          .emit('message_notification', {
            conversationId: data.conversationId,
            message,
          });
      }
    );

    socket.on(
      'message_read',
      async (messageId: string) => {
        await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true },
        });

        const message = await prisma.message.findUnique({
          where: { id: messageId },
        });

        if (message) {
          io.to(
            `conversation:${message.conversationId}`
          ).emit('message_read', messageId);
        }
      }
    );

    socket.on(
      'user_typing',
      (data: { conversationId: string }) => {
        socket.to(
          `conversation:${data.conversationId}`
        ).emit('user_typing', {
          conversationId: data.conversationId,
          userId,
        });
      }
    );

    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`);
    });
  });
}
