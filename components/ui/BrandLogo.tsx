import Image from "next/image";

type BrandLogoProps = {
  width?: number;
  priority?: boolean;
};

// Approved palette 01. Preserve the original outlined artwork and proportions.
export function BrandLogo({ width = 180, priority = false }: BrandLogoProps) {
  return (
    <span className="inline-block shrink-0" style={{ width }}>
      <Image
        src="/brand/ever-knitting-cocoa.svg"
        alt="Ever Knitting"
        width={644}
        height={256}
        className="block h-auto w-full dark:hidden"
        priority={priority}
        unoptimized
      />
      <Image
        src="/brand/ever-knitting-white.svg"
        alt="Ever Knitting"
        width={644}
        height={256}
        className="hidden h-auto w-full dark:block"
        priority={priority}
        unoptimized
      />
    </span>
  );
}
