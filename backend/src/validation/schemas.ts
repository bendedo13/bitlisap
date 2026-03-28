import { z } from 'zod';
import { ListingStatus } from '@prisma/client';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const newsListQuerySchema = paginationQuerySchema.extend({
  category: z.string().max(50).optional(),
});

export const listingsQuerySchema = paginationQuerySchema.extend({
  category: z.string().max(50).optional(),
  district: z.string().max(50).optional(),
  sort: z.enum(['price_asc', 'price_desc']).optional(),
});

export const businessesQuerySchema = paginationQuerySchema.extend({
  category: z.string().max(50).optional(),
  district: z.string().max(50).optional(),
});

export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.1).max(100).default(5),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const sendOtpBodySchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(20)
    .regex(/^\+?[0-9]+$/),
});

export const verifyOtpBodySchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().length(6).regex(/^[0-9]+$/),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(10),
});

export const createNewsBodySchema = z.object({
  title: z.string().min(3).max(300),
  content: z.string().optional(),
  summary: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  thumbnailUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  isBreaking: z.boolean().optional(),
  isOfficial: z.boolean().optional(),
});

export const createListingBodySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  price: z.number().positive().optional(),
  isNegotiable: z.boolean().optional(),
  photos: z.array(z.string().url()).max(10).optional(),
  district: z.string().max(50).optional(),
});

export const updateListingBodySchema =
  createListingBodySchema.partial().extend({
    status: z.nativeEnum(ListingStatus).optional(),
  });

export const premiumListingBodySchema = z.object({
  days: z.union([
    z.literal(3),
    z.literal(7),
    z.literal(30),
  ]),
});

export const createBusinessBodySchema = z.object({
  name: z.string().min(2).max(150),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  district: z.string().max(50).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  website: z.string().url().max(200).optional(),
  instagram: z.string().max(100).optional(),
  workingHours: z.record(z.string()).optional(),
  photos: z.array(z.string().url()).max(10).optional(),
});

export const updateBusinessBodySchema =
  createBusinessBodySchema.partial();

export const reviewBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  photos: z.array(z.string().url()).max(5).optional(),
});

export const createEventBodySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  category: z.string().max(50).optional(),
  isFree: z.boolean().optional(),
  ticketPrice: z.number().positive().optional(),
  maxAttendees: z.number().int().positive().optional(),
  coverImage: z.string().url().optional(),
});

export const updateProfileBodySchema = z.object({
  fullName: z.string().max(100).optional(),
  email: z.string().email().optional(),
  neighborhood: z.string().max(50).optional(),
  district: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export const fcmTokenBodySchema = z.object({
  token: z.string().min(20).max(512),
});

export const messagesPageQuerySchema = paginationQuerySchema;
