import Image from "next/image";
import type { CSSProperties } from "react";

type BrandLogoProps = {
  width?: number;
  mobileWidth?: number;
  priority?: boolean;
};

// Approved concept A: EK symbol and wordmark, with native 1288:256 proportions.
export function BrandLogo({ width = 200, mobileWidth = width, priority = false }: BrandLogoProps) {
  return (
    <span
      className="inline-block w-[var(--brand-logo-mobile-width)] max-w-full shrink-0 sm:w-[var(--brand-logo-width)]"
      style={{
        "--brand-logo-width": `${width}px`,
        "--brand-logo-mobile-width": `${mobileWidth}px`,
      } as CSSProperties}
    >
      <Image
        src="/brand/everknitting-horizontal-cocoa.svg"
        alt="Ever Knitting"
        width={1288}
        height={256}
        className="block h-auto w-full dark:hidden"
        priority={priority}
        unoptimized
      />
      <Image
        src="/brand/everknitting-horizontal-white.svg"
        alt="Ever Knitting"
        width={1288}
        height={256}
        className="hidden h-auto w-full dark:block"
        priority={priority}
        unoptimized
      />
    </span>
  );
}
