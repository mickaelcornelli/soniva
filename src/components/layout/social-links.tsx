import { FacebookIcon, InstagramIcon, XIcon } from "@/components/brand/social-icons";
import { siteConfig } from "@/config/site";

const NETWORKS = [
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "instagram", label: "Instagram", Icon: InstagramIcon },
  { id: "x", label: "X", Icon: XIcon },
] as const;

export function SocialLinks() {
  return (
    <ul aria-label="Réseaux sociaux" className="flex items-center gap-2">
      {NETWORKS.map(({ id, label, Icon }) => (
        <li key={id}>
          <a
            href={siteConfig.social[id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (nouvel onglet)`}
            title={label}
            className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
