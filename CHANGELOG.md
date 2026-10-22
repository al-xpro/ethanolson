# Changelog

All notable changes to this project, newest first. Versions follow
[semver](https://semver.org).

## v2.0 · 2026-10-21

Full stack: the contact form delivers every message, the site is measured and hardened, and
the home page loads a third of what it did.

### Added

- Contact e-mails with Resend and React Email: the message to the inbox (reply-to: the
  visitor) and a confirmation to the visitor. If the e-mail to the inbox fails, the visitor
  keeps the message and sees an error.
- A rate limit on the contact form: one message per visitor per day, counted in Postgres
  (Neon, Drizzle) with a salted hash, never an IP address.
- Cookieless analytics: Vercel Web Analytics, and Umami with three events ("Start a
  project", "Contact submit", "Work view").
- Security headers: a Content Security Policy (only Storyblok's Visual Editor may frame the
  site), X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.
- A failed send during a deployment keeps the message and offers a reload, instead of the
  error page.

### Changed

- The 3D scene loads after the page, and the intro video when its section comes near: the
  home page's first load went from 2.7 MB to 0.85 MB.
- Video posters come through Storyblok's image service as WebP.
- The privacy policy lists what the contact flow and the analytics really do.

### Fixed

- Safari stuttered once scrolling into the outro: the photo is now a CSS background.
- The intro video never played: the pinned section cancelled its autoplay.
- The footer couldn't be revealed after sending the form: scroll animations now re-measure
  when the page's height changes.
- The 404 page flashed its final state before the digits dropped in.

### Removed

- Storing enquiries in a second Storyblok space, and Vercel BotID (not planned).

## v1.1 · 2026-10-21

Pages and polish: the one-page concept becomes a full site, editable in Storyblok, and goes
live on Vercel.

### Added

- Pages: about, services, works with five project pages, contact, privacy policy, terms
  and a 404 page, with a sticky reveal footer.
- A testimonials deck on the home page, and the real projects in the works gallery.
- Storyblok with the Visual Editor: every page's text, images and videos, and the works
  (new ones too), checked against a content model with limits on characters, items and
  file weight. Broken content falls back to the defaults on the published site.
- Draft mode and a signed publish webhook that refreshes the site within seconds.
- A preferred-call date picker on the contact page, with availability that changes every
  month and no booking service; a drawer on phones.
- `llms.txt` that follows the recommendations, a Markdown version of every page, and a
  footer link to see any page as an agent does.
- A minimap for in-page navigation on small screens, and smooth in-page navigation on the
  services and legal pages.
- Production deployments: every merge into `main` deploys.

### Changed

- The hero figure: a modified version of the original optical illusion, reshaped and
  cleaned, in black metal. It turns into place, then turning white strips light it.
- The favicon and icons, rendered from the figure.
- The services section: a sticky four-step timeline instead of a card stack.
- The contact form: on its own page, with errors only after Send.
- Every image has explicit dimensions and a blur placeholder.
- The concept is mentioned only in the footer.

### Fixed

- Safari: the home page froze and wouldn't scroll, and the outro stuttered.
- Layouts in landscape on phones, and every block at least 320px wide.
- Keyboard focus in the parallax sections (works tiles and testimonial links), and
  prohibited ARIA attributes on split text.
- The figure was cut at the bottom on tablets and laptops.

### Removed

- The Penrose triangle, the booking embed, and the scrollbars.

## v1.0 · 2026-10-15

The first public release: the concept portfolio as it was built from January to March
2026, after a clean-up pass in October 2026.

### Added

- An original 3D Penrose triangle in the hero, built in code. It only closes into an
  impossible triangle from one angle, which the intro animation rotates into.
- Reduced-motion fallbacks for every scroll scene.
- An accessible navbar: real links and buttons, a focus trap, Escape to close, a visible
  name and a "Start a project" button.
- SEO: metadata, canonical URL, a generated Open Graph image and icons, JSON-LD and
  `llms.txt`.
- An error page and a typed content layer (`content/`).
- Repository tooling: CI (typecheck, lint, build), issue and pull request templates,
  Dependabot.

### Changed

- One animation engine (GSAP): Motion, Leva and six unused packages removed. Client
  JavaScript went from about 615 KB to about 487 KB gzipped.
- No page-wide loader: content renders right away, and the 3D hero fades in when ready.
- Copy rewritten for a design engineer who builds full-stack products.
- New videos, edited from royalty-free footage, with matching poster frames.

### Removed

- Third-party screenshots (replaced by original wireframe placeholders), invented
  testimonials, the About and Case Studies sections, and both 3D models.
