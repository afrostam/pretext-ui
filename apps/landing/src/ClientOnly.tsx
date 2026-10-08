import React, { useEffect, useState } from "react";

/**
 * Renders `fallback` during prerender and the first client render, then
 * `children`. For content that needs the browser (canvas, measured widths).
 */
export function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}
