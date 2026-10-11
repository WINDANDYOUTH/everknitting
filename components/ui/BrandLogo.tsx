import Image from "next/image";

type BrandLogoProps = {
  width?: number;
  priority?: boolean;
};

// Approved concept A: EK symbol and wordmark, with native 1288:256 proportions.
export function BrandLogo({ width = 250, priority = false }: BrandLogoProps) {
  return (
    <span className="inline-block shrink-0" style={{ width }}>
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
