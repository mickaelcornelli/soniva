import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: LucideIcon;
  /** Nom accessible : le bouton n'a pas de texte visible. */
  label: string;
  /** Pour les boutons bascule (aléatoire, répétition) : allumé en ambre. */
  active?: boolean;
  size?: "sm" | "md";
}

const SIZES = {
  sm: { button: "size-8", icon: "size-4" },
  md: { button: "size-10", icon: "size-5" },
} as const;

export function IconButton({
  icon: Icon,
  label,
  active,
  size = "md",
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "text-accent" : "text-muted hover:text-foreground"
      } ${SIZES[size].button} ${className}`}
      {...props}
    >
      <Icon aria-hidden="true" className={SIZES[size].icon} />
    </button>
  );
}
