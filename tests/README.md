# Vault compatibility tests

Fixtures are synthetic and generated locally with `node tests/make-fixtures.mjs`.
Run `npm test`, then serve the repository root over HTTP and open
`tests/package.test.html`. Do not use `file://`.

The GitHub Pages workflow stages an allowlisted app shell, so this directory is
tested from the repository but is not published.
