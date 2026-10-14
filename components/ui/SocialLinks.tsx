import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { site, type SocialLink } from "@/content/site";

const icons: Record<SocialLink["name"], React.ReactNode> = {
  Instagram: <FaInstagram aria-hidden />,
  YouTube: <FaYoutube aria-hidden />,
  LinkedIn: <FaLinkedin aria-hidden />,
  GitHub: <FaGithub aria-hidden />,
};

export const activeSocials = site.socials.filter((social) => social.href);

export function SocialLinks({
  className,
  linkClassName,
  iconClassName,
}: {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
}) {
  if (activeSocials.length === 0) return null;

  return (
    <ul className={className}>
      {activeSocials.map((social) => (
        <li key={social.name}>
          <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            <span className="flex gap-2 xl:gap-[0.5vw]">
              <span className={iconClassName}>{icons[social.name]}</span>
              {social.name}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
