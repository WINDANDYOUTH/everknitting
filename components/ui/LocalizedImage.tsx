/**
 * LOCALIZED IMAGE COMPONENT
 * 
 * A wrapper around Next.js Image that handles:
 * 1. Localized alt text from translation files
 * 2. SEO-optimized loading strategies
 * 3. Consistent image sizing and quality
 * 
 * Usage:
 * <LocalizedImage 
 *   src="/products/cashmere-sweater.jpg"
 *   altKey="images.hero.alt"
 *   width={800}
 *   height={600}
 * />
 */

"use client";

import Image, { ImageProps } from "next/image";
import { useTranslations } from "next-intl";

interface LocalizedImageProps extends Omit<ImageProps, "alt"> {
  /**
   * Translation key for the alt text
   * e.g., "images.hero.alt" → looks up in messages/[locale].json
   */
  altKey: string;
  
  /**
   * Fallback alt text if translation key is not found
   * Should be a descriptive English alt text
   */
  fallbackAlt?: string;
  
  /**
   * Namespace for translations (default: "images")
   */
  namespace?: string;
}

export function LocalizedImage({
  altKey,
  fallbackAlt = "",
  namespace = "images",
  ...imageProps
}: LocalizedImageProps) {
  const t = useTranslations(namespace);
  
  // Try to get localized alt text, fall back to provided fallback
  let altText: string;
  try {
    // Remove namespace prefix if included in altKey
    const key = altKey.startsWith(`${namespace}.`) 
      ? altKey.slice(namespace.length + 1) 
      : altKey;
    altText = t(key);
  } catch {
    altText = fallbackAlt;
  }

  return (
    <Image
      {...imageProps}
      alt={altText}
    />
  );
}

/**
 * SERVER COMPONENT VERSION
 * For use in Server Components where useTranslations isn't available
 */
interface ServerLocalizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string; // Pre-translated alt text from getTranslations
}

export function ServerLocalizedImage({
  alt,
  ...imageProps
}: ServerLocalizedImageProps) {
  return (
    <Image
      {...imageProps}
      alt={alt}
    />
  );
}

export default LocalizedImage;
