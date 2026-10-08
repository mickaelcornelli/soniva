const BAR_DELAYS = ["0ms", "-300ms", "-600ms"];

interface EqualizerProps {
  /** Animé pendant la lecture, figé en pause. */
  playing: boolean;
  className?: string;
}

export function Equalizer({ playing, className = "" }: EqualizerProps) {
  return (
    <span aria-hidden="true" className={`flex h-3.5 items-end gap-0.5 ${className}`}>
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: delay }}
          className={`h-full w-[3px] rounded-full bg-accent motion-reduce:animate-none ${
            playing ? "animate-equalize" : "scale-y-50"
          }`}
        />
      ))}
    </span>
  );
}
