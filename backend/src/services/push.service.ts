import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

let initialized = false;

function ensureFirebase(): boolean {
  if (admin.apps.length > 0) {
    initialized = true;
    return true;
  }
  if (initialized) return true;
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
  } = config;
  if (
    !FIREBASE_PROJECT_ID ||
    !FIREBASE_PRIVATE_KEY ||
    !FIREBASE_CLIENT_EMAIL
  ) {
    return false;
  }
  try {
    const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        privateKey,
        clientEmail: FIREBASE_CLIENT_EMAIL,
      }),
    });
    initialized = true;
    return true;
  } catch (e) {
    logger.error('Firebase baslatilamadi', {
      message: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  if (!ensureFirebase()) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fcmToken: true },
  });
  const token = user?.fcmToken;
  if (!token) return;

  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: data ?? {},
      android: { priority: 'high' },
      apns: {
        payload: { aps: { sound: 'default' } },
      },
    });
  } catch (e) {
    logger.warn('FCM gonderilemedi', {
      userId,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}

const BATCH = 500;

export async function notifyUsersNewNews(
  newsTitle: string,
  newsId: string
): Promise<void> {
  if (!ensureFirebase()) return;

  const users = await prisma.user.findMany({
    where: {
      fcmToken: { not: null },
    },
    select: { fcmToken: true },
  });

  const tokens = users
    .map((u) => u.fcmToken)
    .filter((t): t is string => Boolean(t));

  for (let i = 0; i < tokens.length; i += BATCH) {
    const chunk = tokens.slice(i, i + BATCH);
    try {
      await admin.messaging().sendEachForMulticast({
        tokens: chunk,
        notification: {
          title: 'Yeni haber',
          body: newsTitle.slice(0, 120),
        },
        data: {
          type: 'news',
          newsId,
        },
      });
    } catch (e) {
      logger.warn('FCM toplu haber bildirimi basarisiz', {
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }
}
