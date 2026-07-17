# GEO IAS Frontend Repository Instructions

These instructions apply to the `learningml/` React/Create React App repository. Read the workspace-root `AGENTS.md`, the product specification, and current planning documents before implementation.

## Git ownership

The user exclusively owns source-control writes. Codex must not stage, commit, push, pull, merge, rebase, reset, stash, tag, create/delete branches, modify remotes, amend commits, or use checkout/restore to overwrite changes. Read-only Git inspection is allowed. Never discard user changes. Suggested commit messages are informational only.

## Framework and infrastructure

- Preserve React/Create React App and the separate frontend repository.
- Preserve `REACT_APP_recommendServiceURL` and the existing production domain/deployment process.
- Do not introduce Docker, a framework replacement, a second frontend application, or a parallel legacy UI.
- Do not expose secrets or persist refresh tokens/passwords in browser storage.

## Legacy classification and replacement

Classify relevant code as KEEP, REFACTOR, REMOVE, or VERIFY BEFORE REMOVAL using `docs/LEGACY_CODE_REMOVAL_PLAN.md`.

- Keep/refactor the generic layout, routing shell, CoreUI tables/forms, charts, API-base configuration, login presentation, import parsing concepts, and reusable styles/components.
- Replace cosmetic localStorage authentication, direct scattered Axios calls, hard-coded campaign/template screens, incomplete API calls, placeholder/sample screens, and dead/commented copies.
- Do not keep replaced files under `old_*`, `legacy_*`, `backup_*`, `unused_*`, or `*_v2` names.
- Before deleting a component/route, find all imports, lazy routes, navigation entries, tests, styles, and backend calls. Connect and verify the replacement first.
- Never remove a frontend caller before its backend contract is available in the same logical change batch.

## Verification and reporting

For applicable changes, run tests, lint checks available through CRA, and `npm run build`. Search for remaining imports/routes/API references after removal. Report created/modified/deleted files, untouched user changes, environment additions, commands/tests/results, risks, and suggested manual frontend/backend commit messages. Stop for user review without committing.
