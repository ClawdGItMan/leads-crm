"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function GenerateSummaryButton({
  variant = "outline",
}: {
  variant?: "default" | "outline" | "secondary" | "ghost";
}) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/summaries/generate", {
        method: "POST",
      });
      const result = (await response.json()) as {
        success?: boolean;
        summaryId?: string;
        error?: string;
      };

      if (!response.ok || !result.success || !result.summaryId) {
        throw new Error(result.error ?? "Could not generate summary");
      }

      toast.success("New summary generated.");
      router.push(`/summaries/${result.summaryId}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate summary");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button type="button" variant={variant} onClick={handleGenerate} disabled={isGenerating}>
      <Sparkles className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Generate Summary"}
    </Button>
  );
}
