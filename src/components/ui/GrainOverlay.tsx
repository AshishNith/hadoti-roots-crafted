export function GrainOverlay({ opacity = 0.12 }: { opacity?: number }) {
  return <div className="grain-overlay" style={{ opacity }} aria-hidden />;
}
