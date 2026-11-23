'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function StatCounter({ end, suffix = '', label, duration = 2000 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>
        {count}{suffix}
      </div>
      <div className="text-sm text-white/70 mt-1 font-medium">{label}</div>
    </div>
  );
}
