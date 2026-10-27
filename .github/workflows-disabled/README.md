# Inherited Twenty workflows (inactive)

These workflows are archived outside `.github/workflows`, so GitHub Actions does
not execute them. Prism uses only `../workflows/ci.yaml`: a production frontend
build and existing routing, chart range and widget layout tests on main pushes
and pull requests. Each job runs unconditionally; failed setup or builds cannot
produce a successful check for skipped validation.

The archive includes Twenty deployments, twenty-infra/twenty-factory dispatches,
releases, publishing, Crowdin synchronization, and the larger upstream test
matrix. Translation catalogs and Crowdin configuration remain in place. Before
restoring any workflow, adapt its infrastructure, permissions, secrets, runner
labels and reusable workflow paths for Prism. Nothing here deploys Prism.

CI installs only the root tools, frontend and transitive workspace dependencies,
using the checked-in Yarn release, hardened resolution/checksum validation and
disabled dependency scripts. Local hardlinks reduce duplicate package storage;
there is no inherited monorepo node_modules cache or runner filesystem cleanup.
`ubuntu-latest` uses standard runners available to this repository, rather than
Twenty's unavailable `ubuntu-latest-8-cores` larger runners.

Server/database integration, email previews, browser/Storybook, desktop and release
checks are outside this basic CI and are not reported as passing.
