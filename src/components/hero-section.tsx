"use client";

import { Download, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { heroContent } from "@/data/portfolio";
import type { HeroContentData } from "@/lib/content";
import { parseImageList } from "@/lib/images";

type HeroSectionProps = {
  content?: HeroContentData;
};

export function HeroSection({ content = heroContent }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [text, setText] = useState("");
  const roles = content.roles.length ? content.roles : heroContent.roles;
  const primaryHref = content.primaryCtaHref || heroContent.primaryCtaHref;
  const isExternalPrimaryHref = /^https?:\/\//.test(primaryHref);
  const shouldDownloadPrimary =
    !isExternalPrimaryHref && !primaryHref.startsWith("#");
  const profileImage = content.profileImage;
  const profileImageAlt = content.profileImageAlt || content.name;
  const photoSlides = useMemo(
    () => parseImageList(profileImage),
    [profileImage],
  );

  useEffect(() => {
    const current = roles[roleIndex] ?? roles[0];
    const isComplete = text.length === current.length;

    if (isComplete) {
      const pause = window.setTimeout(() => {
        setText("");
        setRoleIndex((index) => (index + 1) % roles.length);
      }, 1250);

      return () => window.clearTimeout(pause);
    }

    const typing = window.setTimeout(() => {
      setText(current.slice(0, text.length + 1));
    }, 54);

    return () => window.clearTimeout(typing);
  }, [roleIndex, roles, text]);

  useEffect(() => {
    setPhotoIndex(0);
  }, [profileImage]);

  useEffect(() => {
    if (photoSlides.length < 2) return;

    const slide = window.setInterval(() => {
      setPhotoIndex((index) => (index + 1) % photoSlides.length);
    }, 4200);

    return () => window.clearInterval(slide);
  }, [photoSlides.length]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.12] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="hero-copy-enter max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1 text-xs font-medium text-cyan-200">
            {content.badge}
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            {content.name}
            <span className="mt-3 block bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-2xl text-transparent sm:text-3xl lg:text-4xl">
              {content.headline}
            </span>
          </h1>
          <div className="mt-5 h-8 text-base font-medium text-cyan-100 sm:text-lg">
            <span>{text}</span>
            <span className="ml-1 inline-block h-5 w-px translate-y-1 bg-cyan-200" />
          </div>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={primaryHref}
              download={shouldDownloadPrimary ? true : undefined}
              target={isExternalPrimaryHref ? "_blank" : undefined}
              rel={isExternalPrimaryHref ? "noreferrer" : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              {content.primaryCta}
              <Download size={17} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/[0.14] px-5 py-3 text-sm font-semibold text-ink transition hover:border-cyan-200/[0.45] hover:bg-white/[0.06]"
            >
              {content.secondaryCta}
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        <div
          className="hero-visual-enter relative hidden min-h-[540px] lg:block"
          aria-hidden="true"
        >
          {photoSlides.length ? (
            <>
              <div className="absolute inset-x-0 top-0 flex justify-center">
                <div className="relative h-[350px] w-[300px]">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-200/40 via-blue-400/18 to-violet-400/30 blur-2xl" />
                  <div className="absolute inset-3 rotate-[-2deg] rounded-[2rem] border border-white/15 bg-white p-2 shadow-2xl shadow-cyan-950/35">
                    <div className="h-full overflow-hidden rounded-[1.55rem] bg-white">
                      <div
                        className="flex h-full transition-transform duration-700 ease-out"
                        style={{
                          transform: `translateX(-${photoIndex * 100}%)`,
                        }}
                      >
                        {photoSlides.map((image) => (
                          <div
                            key={image}
                            className="relative h-full min-w-full overflow-hidden"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={profileImageAlt}
                              className="h-full w-full scale-105 object-cover object-[center_16%] transition-transform duration-[4200ms] ease-out"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {photoSlides.length > 1 ? (
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur-xl">
                      {photoSlides.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setPhotoIndex(index)}
                          className={`h-1.5 rounded-full transition-all ${
                            photoIndex === index
                              ? "w-8 bg-cyan-200"
                              : "w-2 bg-white/35 hover:bg-white/55"
                          }`}
                          tabIndex={-1}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="absolute bottom-0 left-4 right-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-rose-400" />
                  <span className="size-2.5 rounded-full bg-amber-300" />
                  <span className="size-2.5 rounded-full bg-emerald-300" />
                </div>

                <div className="mt-4 font-mono text-xs leading-6 text-slate-300">
                  <p>
                    <span className="text-cyan-300">const</span> focus = [
                  </p>
                  <p className="pl-5 text-slate-400">
                    &quot;Fullstack Web Apps&quot;,
                  </p>
                  <p className="pl-5 text-slate-400">
                    &quot;MikroTik Networks&quot;,
                  </p>
                  <p className="pl-5 text-slate-400">
                    &quot;Security Analysis&quot;
                  </p>
                  <p>];</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["Web", "Network", "Security"].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-center text-sm font-semibold text-ink"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-cyan-950/30 backdrop-blur" />
              <div className="absolute left-8 right-8 top-8 rounded-xl border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-rose-400" />
                  <span className="size-2.5 rounded-full bg-amber-300" />
                  <span className="size-2.5 rounded-full bg-emerald-300" />
                </div>
                <div className="mt-6 space-y-3 font-mono text-xs text-slate-300">
                  <p>
                    <span className="text-cyan-300">const</span> focus = [
                  </p>
                  <p className="pl-5 text-slate-400">
                    &quot;Fullstack Web Apps&quot;,
                  </p>
                  <p className="pl-5 text-slate-400">
                    &quot;MikroTik Networks&quot;,
                  </p>
                  <p className="pl-5 text-slate-400">
                    &quot;Security Analysis&quot;
                  </p>
                  <p>];</p>
                </div>
              </div>
              <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-3">
                {["Web", "Network", "Security"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-5 text-center text-sm font-medium text-ink"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
