"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CsvImportButton({
  label = "Import CSV",
  variant = "outline",
  size = "default",
}: {
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import/leads", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        success?: boolean;
        created?: number;
        updated?: number;
        errors?: Array<{ row: number; message: string }>;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Import failed");
      }

      const errorCount = result.errors?.length ?? 0;
      toast.success(
        `Imported ${result.created ?? 0} new lead${result.created === 1 ? "" : "s"} and updated ${result.updated ?? 0}.` +
          (errorCount ? ` ${errorCount} row${errorCount === 1 ? "" : "s"} need attention.` : "")
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <FileUp className="h-4 w-4" />
        {isUploading ? "Importing..." : label}
      </Button>
    </>
  );
}
