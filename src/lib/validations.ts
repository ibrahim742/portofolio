import { z } from "zod";

import { createSlug } from "@/lib/slug";

const slugSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? createSlug(value) : undefined));

const sortOrderSchema = z.coerce.number().int().default(0);
const publishedSchema = z.coerce.boolean().default(true);

export const heroSchema = z.object({
  badge: z.string().trim().min(1),
  name: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  roles: z.array(z.string().trim().min(1)).min(1),
  description: z.string().trim().min(1),
  profileImage: z.string().trim().default(""),
  profileImageAlt: z.string().trim().default(""),
  primaryCta: z.string().trim().min(1),
  primaryCtaHref: z.string().trim().min(1),
  secondaryCta: z.string().trim().min(1),
});

export const aboutSchema = z.object({
  eyebrow: z.string().trim().min(1),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  description: z.string().trim().min(1),
  paragraphs: z.array(z.string().trim().min(1)).min(1),
  highlights: z.array(z.string().trim().min(1)).min(1),
});

export const contactSchema = z.object({
  eyebrow: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  whatsappLabel: z.string().trim().min(1),
  whatsappHref: z.string().trim().min(1),
  emailLabel: z.string().trim().min(1),
  emailHref: z.string().trim().min(1),
  location: z.string().trim().min(1),
  mapHref: z.string().trim().min(1),
  socialLinks: z.array(z.string().trim().min(1)).default([]),
});

export const sectionSchema = z.object({
  eyebrow: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export const brandingSchema = z.object({
  headerImage: z.string().trim().default(""),
  faviconImage: z.string().trim().default(""),
});

export const skillSchema = z.object({
  title: z.string().trim().min(1),
  slug: slugSchema,
  icon: z.string().trim().min(1),
  items: z.array(z.string().trim().min(1)).min(1),
  sortOrder: sortOrderSchema,
  isPublished: publishedSchema,
});

export const serviceSchema = z.object({
  title: z.string().trim().min(1),
  slug: slugSchema,
  icon: z.string().trim().min(1),
  description: z.string().trim().min(1),
  sortOrder: sortOrderSchema,
  isPublished: publishedSchema,
});

export const projectSchema = z.object({
  title: z.string().trim().min(1),
  slug: slugSchema,
  icon: z.string().trim().min(1),
  category: z.string().trim().min(1),
  image: z.string().trim().min(1),
  imageAlt: z.string().trim().min(1),
  description: z.string().trim().min(1),
  techStack: z.array(z.string().trim().min(1)).default([]),
  liveUrl: z.string().trim().default(""),
  sourceUrl: z.string().trim().default(""),
  sortOrder: sortOrderSchema,
  isPublished: publishedSchema,
});

export const workflowSchema = z.object({
  title: z.string().trim().min(1),
  slug: slugSchema,
  icon: z.string().trim().min(1),
  description: z.string().trim().min(1),
  sortOrder: sortOrderSchema,
  isPublished: publishedSchema,
});

export type CollectionKind = "skills" | "services" | "projects" | "workflow";
