"use client";

import React, { useState, useRef, useCallback } from "react";
import { Loader2, CheckCircle, AlertCircle, Upload, X, FileText, Mail, AlertTriangle } from "lucide-react";
import { sendInquiryWithAttachments } from "@/app/actions/send-inquiry";
import { trackFormSubmission } from "@/components/analytics";
import { cn } from "@/lib/utils";

const MATERIALS = [
  "Cashmere",
  "Wool / Wool Blends",
  "Alpaca",
  "Mohair",
  "Custom / Not sure",
] as const;

// File limits - conservative to ensure email delivery
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB total (safe for email)
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ALLOWED_EXTENSIONS = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.gif";

type FileWithPreview = {
  file: File;
  base64: string;
  name: string;
  type: string;
  size: number;
};

/**
 * ContactForm Component
 * 
 * Enhanced contact form with:
 * - Specific knitwear inquiry fields (material, gauge, quantity)
 * - File upload with Base64 encoding for email attachments
 * - Dark/Light theme compatibility
 * - Clear error messaging for large files
 */
export function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timestamp for anti-spam (generated on mount)
  const [timestamp] = useState(() => Date.now().toString());

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFileWarning(null);
    
    const currentTotal = files.reduce((sum, f) => sum + f.size, 0);
    const currentCount = files.length;
    const validFiles: FileWithPreview[] = [];
    let runningTotal = currentTotal;
    const warnings: string[] = [];
    
    for (const file of Array.from(newFiles)) {
      // Check max file count
      if (currentCount + validFiles.length >= MAX_FILES) {
        warnings.push(`Maximum ${MAX_FILES} files allowed`);
        break;
      }
      
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        warnings.push(`"${file.name}" - file type not supported`);
        continue;
      }
      
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        warnings.push(`"${file.name}" exceeds 5MB limit`);
        continue;
      }
      
      // Check total size
      if (runningTotal + file.size > MAX_TOTAL_SIZE) {
        warnings.push(`Total size would exceed 10MB limit`);
        break;
      }
      
      try {
        const base64 = await fileToBase64(file);
        runningTotal += file.size;
        validFiles.push({
          file,
          base64,
          name: file.name,
          type: file.type,
          size: file.size,
        });
      } catch (err) {
        console.error("Failed to read file:", err);
        warnings.push(`Failed to read "${file.name}"`);
      }
    }
    
    if (warnings.length > 0) {
      setFileWarning(warnings.join(". "));
    }
    
    setFiles((prev) => [...prev, ...validFiles]);
  }, [files]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileWarning(null);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setState(null);

    const formData = new FormData(event.currentTarget);
    
    // Prepare attachments data as JSON
    const attachments = files.map((f) => ({
      filename: f.name,
      contentType: f.type,
      base64: f.base64,
      size: f.size,
    }));
    
    formData.set("attachments", JSON.stringify(attachments));

    try {
      const result = await sendInquiryWithAttachments(null, formData);
      setState(result);

      if (result.ok) {
        formRef.current?.reset();
        setFiles([]);
        setFileWarning(null);
        
        // ✅ Track SUCCESSFUL submission - this is the conversion event for GA4
        // Using 'generate_lead' which is a GA4 recommended event for lead generation
        trackFormSubmission({
          formName: "contact_inquiry_success",
          formLocation: "contact_page",
        });
      }
      // Note: We don't track errors/failures to avoid inflating event counts
    } catch (error) {
      console.error("Form submission error:", error);
      setState({ 
        ok: false, 
        message: "Failed to send. Please try emailing us directly at info@everknitting.com" 
      });
    } finally {
      setIsPending(false);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalFileSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="bg-card p-8 md:p-10 rounded-3xl shadow-2xl border border-border">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Start Your Project</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Tell us about your knitwear needs. We&apos;ll respond in 12–24 hours.
      </p>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Anti-spam hidden fields */}
        <input 
          type="text" 
          name="_website" 
          tabIndex={-1} 
          autoComplete="off"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
          }}
          aria-hidden="true"
        />
        <input type="hidden" name="_timestamp" value={timestamp} />

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name">
            <input
              name="name"
              type="text"
              className={inputClass}
              placeholder="Your name"
              maxLength={100}
            />
          </Field>

          <Field label="Email *">
            <input
              name="email"
              type="email"
              className={inputClass}
              placeholder="name@company.com"
              required
              maxLength={200}
            />
          </Field>
        </div>

        {/* Company & Product Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company / Brand">
            <input
              name="company"
              type="text"
              className={inputClass}
              placeholder="Brand / company name"
              maxLength={200}
            />
          </Field>

          <Field label="Product Type">
            <input
              name="productType"
              type="text"
              className={inputClass}
              placeholder="Sweater / Cardigan / Polo..."
              maxLength={200}
            />
          </Field>
        </div>

        {/* Material & Gauge Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Material">
            <select
              name="material"
              className={selectClass}
              defaultValue="Cashmere"
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m} className="bg-card text-foreground">
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Gauge">
            <input
              name="gauge"
              type="text"
              className={inputClass}
              placeholder="e.g. 7gg / 12gg / not sure"
              maxLength={100}
            />
          </Field>
        </div>

        {/* Quantity */}
        <Field label="Quantity">
          <input
            name="quantity"
            type="text"
            className={inputClass}
            placeholder="e.g. 300 pcs total, 3 colors, sizes S–XL"
            maxLength={300}
          />
        </Field>

        {/* Message */}
        <Field label="Requirements / Additional Details">
          <textarea
            name="message"
            className={textareaClass}
            placeholder="Share reference links, target price, timeline, packaging needs, and any QC standards..."
            maxLength={5000}
          />
        </Field>

        {/* File Upload Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              Attachments <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            {files.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {files.length}/{MAX_FILES} files • {formatFileSize(totalFileSize)}/{formatFileSize(MAX_TOTAL_SIZE)}
              </span>
            )}
          </div>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-accent/50",
              dragActive 
                ? "border-primary bg-accent/70" 
                : "border-border bg-muted/30"
            )}
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max 5MB/file, 10MB total • Up to {MAX_FILES} files
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, Word, Excel, JPG, PNG, WebP, GIF
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_EXTENSIONS}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File Warning */}
          {fileWarning && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-700 dark:text-yellow-300 font-medium">{fileWarning}</p>
                <p className="text-yellow-600/80 dark:text-yellow-400/80 text-xs mt-1">
                  For larger files, please email them directly to{" "}
                  <a href="mailto:info@everknitting.com" className="underline">info@everknitting.com</a>
                </p>
              </div>
            </div>
          )}

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((fileData, index) => (
                <div
                  key={`${fileData.name}-${index}`}
                  className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {fileData.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileData.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Remove ${fileData.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Message */}
        {state && (
          <div className={cn(
            "p-4 rounded-xl flex items-start gap-3 text-sm font-medium border",
            state.ok 
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30" 
              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
          )}>
            {state.ok ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <div>
              <span>{state.message}</span>
              {!state.ok && (
                <p className="text-xs mt-1 opacity-80">
                  You can also email us directly at{" "}
                  <a href="mailto:info@everknitting.com" className="underline">info@everknitting.com</a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isPending}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2",
            "bg-primary text-primary-foreground hover:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Sending{files.length > 0 ? ` (${files.length} file${files.length > 1 ? 's' : ''})` : ''}...
            </>
          ) : (
            "Send Inquiry"
          )}
        </button>

        {/* Email Tip Note */}
        <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl border border-border">
          <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Have large files or special requirements?</strong>
              <br />
              Email us directly at{" "}
              <a
                href="mailto:info@everknitting.com"
                className="font-medium text-foreground hover:underline underline-offset-2"
              >
                info@everknitting.com
              </a>
              {" "}— we can handle any file size.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By submitting, you agree we can contact you about your inquiry.
          NDA available upon request.
        </p>
      </form>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Field Component
   ────────────────────────────────────────────────────────────────────────── */
function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Input Styles (Theme-Aware)
   ────────────────────────────────────────────────────────────────────────── */
const inputClass = cn(
  "h-11 w-full rounded-xl px-4 text-sm transition-all outline-none",
  "bg-muted/50 border border-border",
  "text-foreground placeholder:text-muted-foreground",
  "focus:border-primary focus:ring-2 focus:ring-primary/20"
);

const selectClass = cn(
  "h-11 w-full rounded-xl px-4 text-sm transition-all outline-none appearance-none cursor-pointer",
  "bg-muted/50 border border-border",
  "text-foreground",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  // Custom dropdown arrow
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
);

const textareaClass = cn(
  "h-32 w-full resize-none rounded-xl px-4 py-3 text-sm transition-all outline-none",
  "bg-muted/50 border border-border",
  "text-foreground placeholder:text-muted-foreground",
  "focus:border-primary focus:ring-2 focus:ring-primary/20"
);
