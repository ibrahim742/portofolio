import Image from "next/image";

type ProjectImageProps = {
  src: string;
  alt: string;
};

export function ProjectImage({ src, alt }: ProjectImageProps) {
  const shouldUseImg = /^(https?:|data:image\/)/.test(src);

  if (shouldUseImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
    />
  );
}
