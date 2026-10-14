# Changelog

All notable changes to this project. Versions follow [semver](https://semver.org).

## v1.0 · 2026-10

The project as it was before going public, after a clean-up pass.

### Added

- Accessible navbar: real links and buttons, focus trap, Escape to close, a visible name
  and a "Start a project" button
- Reduced-motion fallbacks for every scroll scene
- SEO: metadata, canonical URL, Open Graph image, icons, JSON-LD and `llms.txt`
- Error page, typed content layer (`content/`), CI (typecheck, lint, build), issue and pull
  request templates, Dependabot

### Changed

- One animation engine (GSAP). Motion, Leva and six unused packages removed
- No page-wide loader: content renders right away, and the 3D hero fades in when ready
- Copy rewritten for a design engineer who builds full-stack products
- Videos load from external URLs instead of the repository

### Removed

- Third-party screenshots (replaced by original wireframe placeholders), invented
  testimonials, the About and Case Studies sections, and the 3D laptop model
