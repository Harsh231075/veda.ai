/**
 * Play a success notification sound when assignment is generated.
 * Place your audio file at /public/sounds/success.mp3
 * or update the path below.
 */
export const playSuccessSound = () => {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio("/sounds/success.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Browser may block autoplay — silently ignore
    });
  } catch {
    // Ignore audio errors
  }
};
