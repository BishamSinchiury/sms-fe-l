/**
 * Lightens or darkens a hex color by a percentage
 * positive % = lighter, negative % = darker
 */
const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(255 * percent)));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

/**
 * Takes org data and applies all CSS variables to <html>
 */
export const applyOrgTheme = (org) => {
  const root = document.documentElement;

  const primary = org.primary_color || "#4f46e5";
  const secondary = org.secondary_color || "#16a34a";

  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-primary-hover", adjustColor(primary, 0.08)); // 8% lighter

  root.style.setProperty("--color-secondary", secondary);
  root.style.setProperty("--color-secondary-hover", adjustColor(secondary, 0.08));

  // Optional extras if your org data has them
  if (org.danger_color) {
    const danger = org.danger_color;
    root.style.setProperty("--color-danger", danger);
    root.style.setProperty("--color-danger-hover", adjustColor(danger, 0.08));
  }
};