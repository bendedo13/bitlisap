import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { AuthPayload } from '../middleware/auth';
import { sendPushToUser } from '../services/push.service';

const prisma = new PrismaClient();

const sendMessagePayloadSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  receiverId: z.string().uuid(),
});

export function setupSocketHandlers(io: Server): void {
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
        const parsed = z.string().uuid().safeParse(conversationId);
        if (parsed.success) {
          socket.join(`conversation:${parsed.data}`);
        }
      }
    );

    socket.on(
      'send_message',
      async (data: {
        conversationId: string;
        content: string;
        receiverId: string;
      }) => {
        const parsed = sendMessagePayloadSchema.safeParse(data);
        if (!parsed.success) {
          socket.emit('message_error', {
            error: 'Gecersiz mesaj verisi',
          });
          return;
        }

        const { conversationId, content, receiverId } =
          parsed.data;

        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            receiverId,
            content,
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

        io.to(`conversation:${conversationId}`)
          .emit('new_message', message);

        io.to(`user:${receiverId}`)
          .emit('message_notification', {
            conversationId,
            message,
          });

        const preview =
          content.length > 120
            ? `${content.slice(0, 117)}...`
            : content;
        void sendPushToUser(
          receiverId,
          'Yeni mesaj',
          preview,
          {
            type: 'message',
            conversationId,
          }
        ).catch(() => {});
      }
    );

    socket.on(
      'message_read',
      async (messageId: string) => {
        const idParse = z.string().uuid().safeParse(messageId);
        if (!idParse.success) return;

        await prisma.message.update({
          where: { id: idParse.data },
          data: { isRead: true },
        });

        const message = await prisma.message.findUnique({
          where: { id: idParse.data },
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
        const p = z
          .object({
            conversationId: z.string().uuid(),
          })
          .safeParse(data);
        if (!p.success) return;
        socket.to(
          `conversation:${p.data.conversationId}`
        ).emit('user_typing', {
          conversationId: p.data.conversationId,
          userId,
        });
      }
    );

    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`);
    });
  });
}
