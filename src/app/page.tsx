import {
  Activity,
  Bot,
  Brain,
  Camera,
  CheckCircle,
  ClipboardList,
  Code2,
  CreditCard,
  DraftingCompass,
  Globe2,
  Layers,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Rocket,
  Router,
  Search,
  Settings2,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero-section";
import { ProjectImage } from "@/components/project-image";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { type IconKey } from "@/data/portfolio";
import { getPortfolioContent } from "@/lib/content";

const iconMap: Record<IconKey, LucideIcon> = {
  code: Code2,
  bot: Bot,
  router: Router,
  camera: Camera,
  shield: Shield,
  brain: Brain,
  globe: Globe2,
  settings: Settings2,
  monitor: Monitor,
  search: Search,
  wrench: Wrench,
  layers: Layers,
  "credit-card": CreditCard,
  activity: Activity,
  clipboard: ClipboardList,
  drafting: DraftingCompass,
  rocket: Rocket,
  check: CheckCircle,
  phone: Phone,
  mail: Mail,
  "map-pin": MapPin,
};

function getIcon(icon: string) {
  return iconMap[icon as IconKey] ?? Code2;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main className="min-h-screen overflow-hidden bg-surface text-ink">
      <SiteHeader content={content.hero} branding={content.branding} />
      <HeroSection content={content.hero} />

      <AnimatedSection id="about" className="border-y border-white/10 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <SectionHeading
            eyebrow="About"
            title={content.about.title}
            description={content.about.subtitle}
          />
          <div className="space-y-5 text-sm leading-7 text-muted sm:text-base">
            <p>{content.about.description}</p>
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="grid gap-3 pt-3 sm:grid-cols-3">
              {content.about.highlights.map((item) => (
                <div
                  key={item}
                  className="border-l border-cyan-300/[0.35] py-1 pl-4 text-sm font-medium text-ink"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="skills" className="py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={content.sections.skills.eyebrow}
            title={content.sections.skills.title}
            description={content.sections.skills.description}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.skills.map((skill) => {
              const Icon = getIcon(skill.icon);

              return (
                <div
                  key={skill.title}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-cyan-200/[0.35] hover:bg-white/[0.055]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">
                      <Icon size={18} />
                    </span>
                    <h3 className="text-sm font-semibold text-ink">
                      {skill.title}
                    </h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="services" className="border-y border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <SectionHeading
              eyebrow={content.sections.services.eyebrow}
              title={content.sections.services.title}
              description={content.sections.services.description}
            />
            <div className="grid gap-4">
              {content.services.map((service) => {
                const Icon = getIcon(service.icon);

                return (
                  <div
                    key={service.title}
                    className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-cyan-200/[0.35] sm:grid-cols-[auto_1fr]"
                  >
                    <span className="grid size-11 place-items-center rounded-md bg-blue-300/10 text-blue-200">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="projects" className="py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={content.sections.projects.eyebrow}
            title={content.sections.projects.title}
            description={content.sections.projects.description}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.projects.map((project) => {
              const Icon = getIcon(project.icon);

              return (
                <article
                  key={project.title}
                  className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] transition hover:-translate-y-1 hover:border-cyan-200/[0.35] hover:bg-white/[0.055]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-slate-950/50">
                    <ProjectImage src={project.image} alt={project.imageAlt} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/45 via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 rounded-md border border-white/15 bg-surface/75 px-2.5 py-1 text-xs text-cyan-100 backdrop-blur">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-violet-300/10 text-violet-200">
                        <Icon size={18} />
                      </span>
                      <h3 className="text-base font-semibold text-ink">
                        {project.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted">
                      {project.description}
                    </p>
                    {project.techStack.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.map((item) => (
                          <span
                            key={item}
                            className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-muted"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {project.liveUrl || project.sourceUrl ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-cyan-300/30 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/10"
                          >
                            Demo
                          </a>
                        ) : null}
                        {project.sourceUrl ? (
                          <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-ink transition hover:bg-white/[0.05]"
                          >
                            Source
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="workflow" className="border-y border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={content.sections.workflow.eyebrow}
            title={content.sections.workflow.title}
            description={content.sections.workflow.description}
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {content.workflow.map((step, index) => {
              const Icon = getIcon(step.icon);

              return (
                <div
                  key={step.title}
                  className="relative rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <span className="text-xs font-semibold text-cyan-300/80">
                    0{index + 1}
                  </span>
                  <div className="mt-5 grid size-10 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <ContactSection content={content.contact} />
        </div>
      </AnimatedSection>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Ibrahim Setiawan. All rights reserved.</p>
          <p>
            Built with Next.js, TypeScript, Tailwind CSS, Prisma, and
            Turbopack.
          </p>
        </div>
      </footer>
    </main>
  );
}
