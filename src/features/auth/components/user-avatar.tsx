import type { AppUser } from "../lib/app-user";

interface UserAvatarProps {
  user: AppUser;
  className?: string;
}

export function UserAvatar({ user, className = "size-9" }: UserAvatarProps) {
  if (user.avatarUrl) {
    return (
      // Hosted by Google/GitHub: no next/image optimisation for these domains.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        className={`shrink-0 rounded-full bg-raised object-cover ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-display font-bold text-accent-foreground ${className}`}
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}
