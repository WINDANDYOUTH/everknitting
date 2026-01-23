"use client";

import React from "react";
import { Mail, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SampleConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SampleConsultationModal({
  isOpen,
  onClose,
}: SampleConsultationModalProps) {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const socialOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      description: "Instant response for sample requests",
      action: "Chat on WhatsApp",
      href: "https://wa.me/8615626260157", // Placeholder, user can update
      color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20",
    },
    {
      name: "Email",
      icon: Mail,
      description: "Send us your tech pack or questions",
      action: "Send Email",
      href: "mailto:info@everknitting.com",
      color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl pointer-events-auto ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-amber-50"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Sample Consultation
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Connect with our knitwear specialists directly. We usually
                  respond within 15 minutes during business hours.
                </p>
              </div>

              <div className="space-y-3">
                {socialOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-transparent hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                        option.color
                      )}
                    >
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                        {option.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {option.description}
                      </p>
                    </div>
                    {/* Arrow or action indicator could go here */}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
