import React from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CV_PREVIEW_ID } from "@/components/cv-preview";
import { toast } from "sonner";

export default function DownloadCVButton() {
  const handleDownload = async () => {
    const cvNode = document.getElementById(CV_PREVIEW_ID);
    if (!cvNode) {
      toast.error("Preview not found. Please try again.");
      return;
    }
    // Store original background
    const originalBg = cvNode.style.backgroundColor;
    // Override with a supported color
    cvNode.style.backgroundColor = "#fff";

    toast.info("Generating image...");
    try {
      const canvas = await html2canvas(cvNode, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        windowWidth: cvNode.scrollWidth,
        windowHeight: cvNode.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = "cv.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Download started!", {
        description: "Check your Downloads folder.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not generate CV!", {
        description: "An error occurred.",
      });
    } finally {
      // Restore original background
      cvNode.style.backgroundColor = originalBg;
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="secondary"
      size="sm"
      className="flex gap-2 items-center"
    >
      <Download className="w-4 h-4" />
      Download CV
    </Button>
  );
}
