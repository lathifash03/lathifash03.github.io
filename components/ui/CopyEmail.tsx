"use client";

import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";

export function CopyEmail({
  email,
  label,
  copiedLabel,
  onDark = false,
}: {
  email: string;
  label: string;
  copiedLabel: string;
  onDark?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className={onDark ? buttonStyles.secondaryOnDark : buttonStyles.secondary}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
