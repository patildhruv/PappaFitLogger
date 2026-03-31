import html2canvas from "html2canvas";

export async function captureAndShare(element, { text, filename } = {}) {
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  const fname = filename || `pappafit-summary-${new Date().toISOString().slice(0, 10)}.png`;

  if (navigator.share && blob) {
    const file = new File([blob], fname, { type: "image/png" });
    try {
      await navigator.share({
        title: "Fitness Summary",
        text: text || "Check out my workout summary!",
        files: [file],
      });
      return true;
    } catch (err) {
      if (err.name === "AbortError") return false;
    }
  }

  // Fallback: download
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = fname;
  a.click();
  return true;
}
