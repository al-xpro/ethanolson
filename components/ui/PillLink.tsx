import Link from "next/link";

// The site's outlined pill: inverts on hover
export const pillClass =
  "inline-flex items-center gap-3 rounded-full border border-white xl:border-[0.1vw] px-8 py-4 xl:px-[2vw] xl:py-[1vw] text-sm xl:text-[0.9vw] uppercase tracking-widest text-white transition-colors duration-300 hover:bg-white hover:text-black";

export function PillLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${pillClass} ${className}`}>
      {children}
    </Link>
  );
}
