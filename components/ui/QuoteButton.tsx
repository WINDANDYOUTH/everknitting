"use client";

import React from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
import { trackQuotationRequest } from "@/components/analytics";

interface QuoteButtonProps {
  children?: React.ReactNode;
  source: string;
  productType?: string;
  className?: string;
  href?: string;
}

/**
 * QuoteButton Component
 * 
 * A wrapper around RainbowButton that automatically tracks
 * "Request Quote" clicks to GA4 via GTM.
 * 
 * Usage:
 * <QuoteButton source="hero_cta" productType="cashmere">
 *   Request a Quote
 * </QuoteButton>
 */
export function QuoteButton({
  children = "Request a Quote",
  source,
  productType,
  className,
  href = "/contact-us",
}: QuoteButtonProps) {
  const handleClick = () => {
    // Track the quotation request event
    trackQuotationRequest({
      source,
      productType,
    });
  };

  return (
    <a href={href} onClick={handleClick} className="w-full sm:w-auto">
      <RainbowButton className={cn("w-full sm:w-auto", className)}>
        {children}
      </RainbowButton>
    </a>
  );
}
