import html2pdf from "html2pdf.js";

/**
 * Recursively inline computed styles on a cloned element,
 * replacing any unsupported color functions (lab, oklch, oklab, lch)
 * with a safe fallback so html2canvas can parse them.
 */
function inlineSafeStyles(original: Element, clone: Element) {
  const computed = window.getComputedStyle(original);
  const cloneEl = clone as HTMLElement;

  // These CSS color functions are not supported by html2canvas
  const unsupported = /\b(lab|oklch|oklab|lch)\s*\(/i;

  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    const value = computed.getPropertyValue(prop);

    if (unsupported.test(value)) {
      // Replace unsupported colors with a safe fallback
      if (prop.includes("background")) {
        cloneEl.style.setProperty(prop, "#ffffff");
      } else {
        cloneEl.style.setProperty(prop, "#000000");
      }
    } else {
      cloneEl.style.setProperty(prop, value);
    }
  }

  const origChildren = original.children;
  const cloneChildren = clone.children;
  for (let i = 0; i < origChildren.length; i++) {
    if (cloneChildren[i]) {
      inlineSafeStyles(origChildren[i], cloneChildren[i]);
    }
  }
}

export const downloadPaperAsPdf = (elementId: string, filename = "Question_Paper") => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Clone the element so we don't affect the live DOM
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = "794px";
  clone.style.background = "#ffffff";
  document.body.appendChild(clone);

  // Inline all styles with safe color replacements
  inlineSafeStyles(element, clone);

  const opt = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: "jpeg" as const, quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait" as const,
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf()
    .set(opt)
    .from(clone)
    .save()
    .then(() => {
      document.body.removeChild(clone);
    })
    .catch(() => {
      document.body.removeChild(clone);
    });
};

