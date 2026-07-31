import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children: React.ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "[animation-direction:reverse]": reverse,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
            })}
          >
            {children}
          </div>
        ))}
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% - var(--gap)));
          }
        }
        @keyframes marquee-vertical {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-100% - var(--gap)));
          }
        }
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
        }
        .animate-marquee-vertical {
          animation: marquee-vertical var(--duration) linear infinite;
        }
      `}</style>
    </div>
  );
}
