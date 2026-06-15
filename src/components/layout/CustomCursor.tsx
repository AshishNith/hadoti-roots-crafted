import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null); // main container
  const leafWrapperRef = useRef<HTMLDivElement>(null); // leaf wrapper
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const leafWrapper = leafWrapperRef.current!;
    const label = labelRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let lastAngle = 45; // default rest angle
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      // Easing for the inner dot
      dx += (mx - dx) * 0.25;
      dy += (my - dy) * 0.25;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;

      // Easing for the main container (translates the leaf + label)
      rx += (mx - rx) * 0.08;
      ry += (my - ry) * 0.08;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

      // Calculate rotation for the leaf wrapper specifically
      const vx = mx - rx;
      const vy = my - ry;
      const speed = Math.sqrt(vx * vx + vy * vy);

      let targetAngle = lastAngle;
      if (speed > 1) {
        // Point in direction of movement (+45 because the leaf is drawn diagonally)
        targetAngle = Math.atan2(vy, vx) * (180 / Math.PI) + 45;
      } else {
        targetAngle = 45; // rest state
      }

      // Handle wrapping for smooth 360 rotation transitions
      let angleDiff = targetAngle - lastAngle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      lastAngle += angleDiff * 0.15;

      leafWrapper.style.transform = `rotate(${lastAngle}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,[role='button'],input,textarea,select,label");

      if (interactive) {
        ring.classList.add("is-hovering");
        dot.classList.add("is-hovering");

        // Custom label support
        const customLabel = 
          (interactive as HTMLElement).getAttribute("data-cursor-label") || 
          (interactive.tagName === "A" && !interactive.classList.contains("btn") ? "view" : "");

        if (customLabel) {
          label.textContent = customLabel;
          label.classList.add("visible");
        } else {
          label.textContent = "";
          label.classList.remove("visible");
        }
      } else {
        ring.classList.remove("is-hovering");
        dot.classList.remove("is-hovering");
        label.textContent = "";
        label.classList.remove("visible");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring-container flex items-center" aria-hidden>
        <div ref={leafWrapperRef} className="cursor-leaf-wrapper">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="cursor-leaf text-[color:var(--earth)] transition-all duration-350"
          >
            <path 
              d="M2 22C2 22 8 20 12 16C16 12 22 2 22 2C22 2 12 8 8 12C4 16 2 22 2 22Z" 
              className="leaf-fill fill-[rgba(139,94,60,0.08)] transition-all duration-350" 
            />
            <path d="M2 22L16 8" />
            <path d="M7 17L9 13" />
            <path d="M11 13L14 11" />
          </svg>
        </div>
        <span 
          ref={labelRef} 
          className="cursor-label font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[color:var(--earth)] bg-[color:var(--cream)]/80 backdrop-blur-[2px] border border-[color:var(--border)] px-2.5 py-1 rounded-sm ml-4 transition-all duration-300 transform scale-50 opacity-0 pointer-events-none select-none whitespace-nowrap" 
        />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
