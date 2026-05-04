import { prisma } from "@/lib/prisma";
import { defaultPortfolioContent } from "@/data/portfolio";
import {
  defaultBrandingContent,
  type BrandingContentData,
} from "@/lib/branding";

export type HeroContentData = {
  badge: string;
  name: string;
  headline: string;
  roles: readonly string[];
  description: string;
  profileImage: string;
  profileImageAlt: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
};

export type AboutContentData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  paragraphs: readonly string[];
  highlights: readonly string[];
};

export type ContactContentData = {
  eyebrow: string;
  title: string;
  description: string;
  whatsappLabel: string;
  whatsappHref: string;
  emailLabel: string;
  emailHref: string;
  location: string;
  mapHref: string;
  socialLinks: readonly string[];
};

export type SectionContentData = {
  eyebrow: string;
  title: string;
  description: string;
};

export type SkillContentData = {
  title: string;
  icon: string;
  items: readonly string[];
};

export type ServiceContentData = {
  title: string;
  icon: string;
  description: string;
};

export type ProjectContentData = {
  title: string;
  icon: string;
  category: string;
  image: string;
  imageAlt: string;
  description: string;
  techStack: readonly string[];
  liveUrl: string;
  sourceUrl: string;
};

export type WorkflowContentData = {
  title: string;
  icon: string;
  description: string;
};

export type PortfolioContent = {
  branding: BrandingContentData;
  hero: HeroContentData;
  about: AboutContentData;
  contact: ContactContentData;
  sections: {
    skills: SectionContentData;
    services: SectionContentData;
    projects: SectionContentData;
    workflow: SectionContentData;
  };
  skills: SkillContentData[];
  services: ServiceContentData[];
  projects: ProjectContentData[];
  workflow: WorkflowContentData[];
};

const fallbackContent: PortfolioContent = {
  branding: defaultBrandingContent,
  hero: {
    ...defaultPortfolioContent.hero,
    roles: [...defaultPortfolioContent.hero.roles],
  },
  about: {
    ...defaultPortfolioContent.about,
    paragraphs: [...defaultPortfolioContent.about.paragraphs],
    highlights: [...defaultPortfolioContent.about.highlights],
  },
  contact: defaultPortfolioContent.contact,
  sections: defaultPortfolioContent.sections,
  skills: defaultPortfolioContent.skills.map((skill) => ({
    ...skill,
    items: [...skill.items],
  })),
  services: defaultPortfolioContent.services.map((service) => ({ ...service })),
  projects: defaultPortfolioContent.projects.map((project) => ({ ...project })),
  workflow: defaultPortfolioContent.workflow.map((step) => ({ ...step })),
};

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const [
      branding,
      hero,
      about,
      contact,
      sectionRows,
      skills,
      services,
      projects,
      workflow,
    ] = await Promise.all([
      prisma.brandingContent.findUnique({ where: { key: "main" } }),
      prisma.heroContent.findUnique({ where: { key: "main" } }),
      prisma.aboutContent.findUnique({ where: { key: "main" } }),
      prisma.contactContent.findUnique({ where: { key: "main" } }),
      prisma.sectionContent.findMany(),
      prisma.skillCategory.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
      prisma.service.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
      prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
      prisma.workflowStep.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
    ]);

    const sectionMap = Object.fromEntries(
      sectionRows.map((section) => [section.key, section]),
    );

    return {
      branding: branding ?? fallbackContent.branding,
      hero: hero ?? fallbackContent.hero,
      about: about ?? fallbackContent.about,
      contact: contact ?? fallbackContent.contact,
      sections: {
        skills: sectionMap.skills ?? fallbackContent.sections.skills,
        services: sectionMap.services ?? fallbackContent.sections.services,
        projects: sectionMap.projects ?? fallbackContent.sections.projects,
        workflow: sectionMap.workflow ?? fallbackContent.sections.workflow,
      },
      skills,
      services,
      projects,
      workflow,
    };
  } catch (error) {
    console.warn(
      "Using default portfolio content because database is unavailable.",
      error,
    );
    return fallbackContent;
  }
}
