import type { PrismaClient } from "@prisma/client";

import { defaultPortfolioContent } from "@/data/portfolio";
import { createSlug } from "@/lib/slug";

type PrismaLike = PrismaClient;

export async function seedDefaultPortfolioContent(prisma: PrismaLike) {
  const existingBranding = await prisma.brandingContent.findUnique({
    where: { key: "main" },
  });
  const branding =
    existingBranding ??
    (await prisma.brandingContent.create({
      data: { key: "main" },
    }));

  const existingHero = await prisma.heroContent.findUnique({
    where: { key: "main" },
  });
  const hero =
    existingHero ??
    (await prisma.heroContent.create({
      data: {
        key: "main",
        ...defaultPortfolioContent.hero,
        roles: [...defaultPortfolioContent.hero.roles],
      },
    }));

  const existingAbout = await prisma.aboutContent.findUnique({
    where: { key: "main" },
  });
  const about =
    existingAbout ??
    (await prisma.aboutContent.create({
      data: {
        key: "main",
        ...defaultPortfolioContent.about,
        paragraphs: [...defaultPortfolioContent.about.paragraphs],
        highlights: [...defaultPortfolioContent.about.highlights],
      },
    }));

  const existingContact = await prisma.contactContent.findUnique({
    where: { key: "main" },
  });
  const contact =
    existingContact ??
    (await prisma.contactContent.create({
      data: {
        key: "main",
        ...defaultPortfolioContent.contact,
        socialLinks: [...defaultPortfolioContent.contact.socialLinks],
      },
    }));

  const existingSectionKeys = new Set(
    (await prisma.sectionContent.findMany({ select: { key: true } })).map(
      (section) => section.key,
    ),
  );
  const createdSections = await Promise.all(
    Object.entries(defaultPortfolioContent.sections)
      .filter(([key]) => !existingSectionKeys.has(key))
      .map(([key, section]) =>
        prisma.sectionContent.create({ data: { key, ...section } }),
      ),
  );

  const existingSkillCount = await prisma.skillCategory.count();
  const skills =
    existingSkillCount > 0
      ? []
      : await Promise.all(
          defaultPortfolioContent.skills.map((skill, index) =>
            prisma.skillCategory.create({
              data: {
                ...skill,
                items: [...skill.items],
                slug: createSlug(skill.title),
                sortOrder: index,
                isPublished: true,
              },
            }),
          ),
        );

  const existingServiceCount = await prisma.service.count();
  const services =
    existingServiceCount > 0
      ? []
      : await Promise.all(
          defaultPortfolioContent.services.map((service, index) =>
            prisma.service.create({
              data: {
                ...service,
                slug: createSlug(service.title),
                sortOrder: index,
                isPublished: true,
              },
            }),
          ),
        );

  const existingProjectCount = await prisma.project.count();
  const projects =
    existingProjectCount > 0
      ? []
      : await Promise.all(
          defaultPortfolioContent.projects.map((project, index) =>
            prisma.project.create({
              data: {
                ...project,
                techStack: [...project.techStack],
                slug: createSlug(project.title),
                sortOrder: index,
                isPublished: true,
              },
            }),
          ),
        );

  const existingWorkflowCount = await prisma.workflowStep.count();
  const workflow =
    existingWorkflowCount > 0
      ? []
      : await Promise.all(
          defaultPortfolioContent.workflow.map((step, index) =>
            prisma.workflowStep.create({
              data: {
                ...step,
                slug: createSlug(step.title),
                sortOrder: index,
                isPublished: true,
              },
            }),
          ),
        );

  return {
    branding,
    hero,
    about,
    contact,
    sections: createdSections.length,
    skills: skills.length,
    services: services.length,
    projects: projects.length,
    workflow: workflow.length,
  };
}
