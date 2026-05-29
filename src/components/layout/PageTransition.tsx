import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";

export function PageTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = curtainRef.current!;
    const unsub = router.subscribe("onBeforeLoad", () => {
      gsap.fromTo(
        el,
        { yPercent: -100 },
        {
          yPercent: 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.to(el, {
              yPercent: -100,
              duration: 0.5,
              delay: 0.05,
              ease: "power3.inOut",
            });
          },
        },
      );
    });
    return () => unsub();
  }, [router]);

  return <div ref={curtainRef} className="page-curtain" aria-hidden />;
}
