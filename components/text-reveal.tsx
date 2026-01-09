"use client";

import { useEffect, useRef, useState } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <span
        className={`inline-block transition-transform duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </span>
    </span>
  );
}
