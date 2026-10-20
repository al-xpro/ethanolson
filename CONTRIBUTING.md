# Contributing

Thanks for your interest. This is a personal concept project by
[Alex Prostamo](https://alxpro.com), developed in the open. Here's how it accepts help.

## Issues are welcome

- **Found a bug?** Open an issue with the **Fix** template: what happens, where (browser,
  device), and the steps to reproduce it.
- **Have an idea?** Open an issue with the **Feature** template. Explain the problem before
  the solution.
- **Found a security problem?** Don't open an issue. Follow [SECURITY.md](SECURITY.md).

## Pull requests

Code changes are made by Alex, with AI agents: every change goes through a pull request
that CI checks, and Alex merges. Outside pull requests
are accepted only for issues labeled `good first issue`, and only after you comment on the
issue and Alex replies.

The code has no open-source license (see [LICENSE](LICENSE)). By opening a pull request,
you agree that your contribution may be included in the project under the same terms.

If you do open one:

1. Branch from the latest `main`, named after the issue: `fix/18-mobile-menu`.
2. Use [Conventional Commits](https://www.conventionalcommits.org): `fix(nav): close the
   menu on Escape`.
3. Run the checks before pushing:

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

4. Fill in the pull request template, and add `Closes #18`.

## Conduct

Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
