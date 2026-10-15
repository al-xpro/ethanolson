# Changelog

All notable changes to this project, newest first. Versions follow
[semver](https://semver.org).

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
