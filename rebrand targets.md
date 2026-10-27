# Prism — Rebrand Targets

Audit date: 2026-10-26
Project: `msg-builds/Prism`
Branch: `prism-rebrand`, based on Twenty `v2.51.0`
Purpose: an actionable inventory, not an instruction to delete features or deploy changes.

## Direction and decisions already made

- The product is called **Prism**. The word Prism stays Prism in every language.
- Emails need full Prism branding.
- MCP and API identity are lower priority because the intended access is private and limited to the Nebula model/service. This is an intention, not a verified access restriction: authentication, authorization, network isolation and actual integration still need to be designed and tested.
- Replace customer-facing settings/help/community/support/documentation links with disabled placeholders or hide them until real destinations exist. A placeholder should not navigate to an unrelated site, `#`, or a fabricated policy. Retain required license/source notices and truthful upstream attribution.
- Dashboards, charts and page layouts remain available; their user-facing features should be off by default and enabled through toggles. Do not delete their data or functionality.
- The intended shared stack is Better Auth + organization plugin, CASL, ZenStack + PostgreSQL row-level security, GrowthBook or FeatBit, OpenMeter, and LiteLLM where model calls require it. These are intended integrations, not an inventory of components already installed in Prism.
- Prism is planned to sit alongside the private `msg-builds/Orbit`, `msg-builds/Nebula` and `msg-builds/gravity` repositories. Source-of-truth boundaries and integration contracts have not been established.

## Audit scope and limits

The review surveyed the monorepo's frontend, server, email, shared packages, localization catalogs, settings navigation, upstream apps/tooling, documentation/website packages, release configuration and currently running Compose configuration. Targeted searches used branding terms, upstream domains, asset names, authentication and feature-related paths. Searches also return many internal imports, migration names, tests and vendor references; these are not all rebrand targets. This document lists the confirmed high-value surfaces and package-level follow-ups, not a guarantee that every dynamic string or image has been visually checked. No browser surface was available for a full interactive audit. Existing data, credentials, containers, licenses and uncommitted work were preserved.

The local instance serves a Prism frontend mounted into the upstream `twentycrm/twenty:v2.51.0` server image. A healthy server and HTTP 200 were observed, but the entire application, all user journeys and actual outgoing email delivery have not been verified. Existing source changes are uncommitted. No source code has been publicly released by this audit.

## Current rebrand status

Already changed in the frontend source and local frontend build:

- [x] Browser title, favicon, manifest name and Prism icon files.
- [x] Main sign-in mark and a selection of welcome, onboarding, data, AI and activity text.
- [x] Prism-branded replacement at the integration logo path used by several onboarding screens.
- [x] Sign-in attribution says the product is built on Twenty; this is an upstream attribution, not a source offer for Prism's modified code.
- [x] Selected title/activity tests passed previously. This is not comprehensive visual or functional acceptance.

Not done: full emails, all remaining screens, full locales, private Nebula-only API access, shared-stack integration, feature switches, comprehensive visual review, or a reproducible Prism server image.

## P0 — Email branding and delivery

### Shared email identity

- [ ] `packages/twenty-emails/src/components/Logo.tsx`: replace the remote `app.twenty.com` icon and Twenty alt text with a Prism-hosted or embedded asset. Use an absolute HTTPS URL when remote image delivery is used; localhost does not work for external recipients.
- [ ] `packages/twenty-emails/src/components/BaseHead.tsx`: update the email document title.
- [ ] `packages/twenty-emails/src/components/Footer.tsx`: remove Twenty website/social/help links from customer-facing emails; replace with disabled/omitted placeholders until Prism destinations exist. Replace Twenty corporate identity with the correct operator identity only once supplied. Keep separate, accurate upstream attribution where appropriate.
- [ ] `packages/twenty-emails/src/components/WhatIsTwenty.tsx`: replace or remove the Twenty product introduction. Write a short Prism explanation that matches the eventual product.
- [ ] `packages/twenty-emails/src/components/BaseEmail.tsx` and `packages/twenty-emails/src/constants/DefaultWorkspaceLogo.ts`: review shared wrapper and fallback workspace images.
- [ ] `packages/twenty-server/src/engine/core-modules/twenty-config/config-variables.ts` and email driver configuration: plan sender name/address, reply-to, transport, assets, and message URLs. No sender/domain credentials have been supplied. Do not invent them.

### Message-by-message inventory

Review subject, sender, body, logo, links and translations in every template; a shared wrapper may introduce branding even when an individual file does not mention Twenty.

- [ ] `packages/twenty-emails/src/emails/send-invite-link.email.tsx`; server sender and subject in `packages/twenty-server/src/engine/core-modules/workspace-invitation/services/workspace-invitation.service.ts` and approved-domain invitation routes.
- [ ] `send-email-verification-link.email.tsx`, `password-reset-link.email.tsx`, `password-update-notify.email.tsx`.
- [ ] `two-factor-authentication-recovery-code-issued.email.tsx`, `two-factor-authentication-reset.email.tsx`, `server-admin-access-changed.email.tsx`, `validate-approved-access-domain.email.tsx`.
- [ ] `billing-subscription-renewing.email.tsx`, `billing-trial-converting.email.tsx`, `billing-trial-ending.email.tsx`: decide whether to disable upstream Twenty billing emails or replace them when OpenMeter and Prism's actual billing flows are designed. Do not present Twenty's billing terms as Prism's.
- [ ] `warn-suspended-workspace.email.tsx`, `clean-suspended-workspace.email.tsx`, `test.email.tsx`.
- [ ] Search additional server-triggered subjects, sender names, system notifications, generated links, in-app copy and templates when implementing; match them to the complete journey rather than changing only filenames above.
- [ ] Render sample emails across supported locales; test invite, verification, password reset and other enabled flows with a controlled test mail transport and inspect actual content and links. Do not send test mail to other people without explicit authorization.

## P0 — Product-facing links, support and external branding

- [ ] `packages/twenty-front/src/modules/settings/hooks/useSettingsNavigationItems.tsx`: replace/hide Twenty community, documentation and support destinations; keep product functions and logout. Settings visibility depends on permissions and flags.
- [ ] `packages/twenty-front/src/pages/settings/community/SettingsCommunity.tsx`: remove or hide Twenty partner, social, release and support links; leave inactive placeholders if a visible future slot is useful.
- [ ] `packages/twenty-front/src/modules/support/utils/getDocumentationUrl.ts`, `packages/twenty-shared/src/constants/DocumentationBaseUrl.ts`, `packages/twenty-front/src/modules/auth/utils/getTwentyWebsiteUrl.ts`: audit every caller before changing shared link builders. Some point to actual upstream documentation; do not misrepresent them as Prism documentation.
- [ ] `packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowEditActionFormBuilder.tsx`: replace or hide the upstream workflow help link if that editor remains available.
- [ ] `packages/twenty-front/src/modules/navigation-menu-item/edit/hooks/useNavigationMenuItemAddOptions.tsx`: avoid creating a default Twenty website link in a Prism workspace.
- [ ] `packages/twenty-front/src/modules/settings/data-model/constants/SettingsCompositeFieldTypeConfigs.ts`: replace Twenty-branded example contacts and links with neutral example data, not real domains or contact details.
- [ ] `packages/twenty-front/src/pages/settings/enterprise/SettingsEnterprise.tsx`, `packages/twenty-front/src/modules/settings/billing/` and `packages/twenty-front/src/pages/settings/billing/`: hide upstream sales/upgrade experiences when not applicable; preserve any actual Twenty commercial license behavior that is legitimately in use.
- [ ] `packages/twenty-front/src/modules/settings/admin-panel/components/SettingsAdminVersionDisplay.tsx` and `packages/twenty-server/src/engine/core-modules/admin-panel/services/admin-panel-version.service.ts`: separate internal upstream version diagnostics from any customer-facing Prism version/update links.
- [ ] `packages/twenty-front/src/modules/onboarding/constants/OnboardingNetworkPreviewPeople.ts` and server prefill data: review upstream-hosted sample imagery; self-host approved alternatives or remove sample visuals. Do not alter real customer records.
- [ ] Audit remaining settings, empty states, banners, tooltips, accessibility labels, not-found/error states, mobile paths and user-visible system events in `packages/twenty-front/src/`.

## P0 — Legal, privacy and open-source notices

- [ ] Do not present `packages/twenty-server/src/engine/core-modules/dpa/` or Twenty's privacy policy/terms as contracts with Prism. Hide or replace Twenty-specific legal UI and templates as appropriate; never simply replace company names in an existing signed/pre-signed document.
- [ ] Determine the operating entity, intended customers and jurisdictions, hosting locations, actual data flows, model providers, subprocessors, retention/deletion process and support contact. These inputs are required before drafting a truthful Prism privacy notice and any customer agreements.
- [ ] A separate legal page is not automatically required just because the product is called Prism. Privacy information and contractual/DPA requirements depend on where and how Prism is used and what personal data it processes. For example, UK GDPR, where applicable, requires specified privacy information; an agreement with customers or a processor DPA may be needed depending on the relationship. Get jurisdiction-specific legal advice before launch.
- [ ] Preserve repository `LICENSE`, MIT notices, commercial-license boundaries and applicable copyright notices. Files marked `/* @license Enterprise */` are subject to Twenty's commercial terms, not automatically the AGPL.
- [ ] For a modified AGPL-covered version accessible to remote users, plan a prominent offer to those users of the corresponding source as required by section 13. This is separate from a Prism privacy notice. Twenty's application exception covers certain independent applications through its defined interfaces; it does not exempt a modified Twenty fork.
- [ ] Treat the user preference to remove ordinary external links separately from any legally required license/source notice. Don't create a fake source link or publish code without an explicit publishing instruction.

Sources: https://github.com/twentyhq/twenty/blob/twenty/v2.51.0/LICENSE ; https://github.com/twentyhq/twenty/blob/twenty/v2.51.0/.github/TRADEMARK.md ; https://www.gnu.org/licenses/gpl-faq.en.html ; https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/

## P0 — Brand text and translations

There are 35 `.po` catalogs in each of the frontend, server and email areas, including the pseudo-English test catalog; these are file counts, not a promise that every translation is complete.

- [ ] Frontend: `packages/twenty-front/src/locales/` and `packages/twenty-front/lingui.config.ts`.
- [ ] Server messages: `packages/twenty-server/src/engine/core-modules/i18n/locales/` and its Lingui configuration.
- [ ] Emails: `packages/twenty-emails/src/locales/` and `packages/twenty-emails/lingui.config.ts`.
- [ ] Locale definitions and direction: `packages/twenty-shared/src/translations/constants/AppLocales.ts` and related translation utilities.
- [ ] Update source messages first, then use the project's extraction/compilation pipeline and have the affected translations updated. For every supported language, keep the proper name **Prism** unchanged while translating the surrounding words naturally. Examples: “Welcome to Prism,” “Join your team on Prism,” “Prism account,” and “Prism workspace”; use natural equivalents for each locale rather than copying English sentences into every language.
- [ ] Translate email subjects, buttons, account/security instructions, errors, onboarding, settings and feature-toggle descriptions, including pluralization and variable placeholders. Check right-to-left rendering where applicable.
- [ ] Preserve legitimate references to Twenty as the upstream project, actual vendor services and legal attribution; keep protocol names, package names, URLs and IDs intact where they must remain exact. Do not globally replace every occurrence of `twenty`.
- [ ] Review missing translations and fallbacks, regenerate compiled catalogs, then test English plus representative non-English and right-to-left locales. Human language review is needed before claiming all locales are translated correctly.

## P1 — Brand assets and app surface

- [ ] `packages/twenty-front/index.html`, `packages/twenty-front/public/manifest.json`, `packages/twenty-front/public/prism-icon.svg`, `prism-192.png`, `prism-512.png`: validate current provisional mark, browser tab, PWA installation, pinned shortcuts and metadata. Replace with approved Prism brand assets if provided.
- [ ] Audit `packages/twenty-front/public/images/icons/`, `images/integrations/`, onboarding/empty-state illustrations and any packaged icons still containing the Twenty mark. Preserve third-party logos as third-party logos.
- [ ] Review sign-in, sign-up, password reset, user profile, workspace creation, navigation, onboarding, notifications, loading, errors, browser titles, accessibility labels, exported documents and email clients. Check the actual rendered paths and enabled flags.
- [ ] Decide Prism wording for CRM-specific language where it is misleading. Avoid removing record creation, editing, searching or permissions simply because the visual experience changes.

## P1 — Feature toggles and default experience

- [ ] Define dashboard, chart and page-layout capabilities as separately testable toggles with defaults off for ordinary users, while preserving saved dashboards, charts, records, views and configuration. Decide whether each toggle is per organization, workspace, user or administrator-controlled.
- [ ] Review existing Twenty flag implementation in `packages/twenty-front/src/modules/workspace/hooks/useIsFeatureEnabled.ts` and `packages/twenty-server/src/engine/core-modules/feature-flag/`; map, bridge or replace it deliberately when GrowthBook/FeatBit is chosen. The new toggles are not implemented yet.
- [ ] When disabled, define both navigation/presentation behavior and relevant server/API behavior. A hidden screen does not replace authorization. Do not turn off the underlying data model or APIs solely because a dashboard is hidden.
- [ ] Keep a minimal administrator data browser, data-model configuration, connections, identity/access, system health, audit and export/recovery capability. Decide which normal-user settings should be hidden or moved to shared products.
- [ ] Review optional CRM pipelines, communications, campaigns, workflows, Twenty AI chat and marketplace by feature, not by deleting packages wholesale. Ingestion, event processing and required security may depend on them.

## P1 — Private Nebula access and integration identity

- [ ] Define the actual Nebula caller: model-facing agent/tool, Nebula server or workflow service, runtime/deployment, service identity, allowed organizations/workspaces, operations, data categories and authentication method. “Only our model” is a product goal, not a currently proven technical boundary.
- [ ] Integrate a private, authenticated, least-privilege service connection with appropriate network restrictions. Deny other callers, cover credential rotation, revoke, expiry, and log safe access evidence. Review all REST, GraphQL, MCP, webhooks, background and direct-data access paths; protect against bypass. Do not expose API credentials to browser code or model prompts.
- [ ] Preserve upstream API names if renaming would break SDKs or integrations. MCP/API wording is low-priority brand cleanup, but security and workspace scoping are high-priority functionality.
- [ ] Confirmed internal branding targets: `packages/twenty-server/src/engine/api/mcp/constants/mcp-server-info.const.ts`, `packages/twenty-server/src/engine/api/mcp/utils/build-mcp-server-instructions.util.ts`, and `packages/twenty-server/src/engine/core-modules/well-known/utils/build-mcp-server-card.util.ts`.
- [ ] `packages/twenty-front/src/modules/settings/mcp/constants/McpSetup.ts` and `buildMcpSetupCategories.tsx`: disable or remove public setup links that do not fit the private-only design. Twenty's official ChatGPT integration is an actual Twenty service; don't falsely label it as Prism or imply it is the private Nebula integration.
- [ ] Define Orbit and Nebula data-access contracts and source-of-truth boundaries. Nebula already has workflow tables and knowledge; avoid assuming all data belongs in Prism. Gravity needs a connection only for explicitly authorized desktop use.
- [ ] Audit external outbound dependencies such as `packages/twenty-server/src/engine/core-modules/tool/tools/search-help-center-tool/`, the marketplace catalog, enterprise license API, version checks, telemetry/Sentry configuration and hosted placeholder assets. A reference or default in code does not prove an outgoing connection occurred. Decide, configure and verify real behavior before claiming the instance is fully private.

## P1 — Shared stack integration (not yet implemented)

- [ ] Better Auth + organization plugin: map identities, organizations, workspaces, sessions, invitations and service identities to the existing Twenty model; test migration and revocation. Decide authoritative source.
- [ ] CASL: design permission policies and map them to Twenty's existing roles and server checks; test both allowed and denied API/agent actions.
- [ ] ZenStack + PostgreSQL RLS: assess compatibility with Twenty's ORM and dynamic workspace schema; prototype tenant context and independently test cross-workspace isolation, privileged connections, jobs and migrations. Do not assume a dependency alone enforces isolation.
- [ ] GrowthBook or FeatBit: choose the system, define defaults and evaluation/failure behavior, and build any workspace-admin toggle UX. Keep feature availability distinct from user authorization and paid entitlements.
- [ ] OpenMeter: decide billable events, usage ownership, entitlements, quotas, idempotency and behavior when metering is unavailable. Replace or hide Twenty billing where appropriate.
- [ ] LiteLLM: integrate only in the component that actually routes model calls; determine whether Prism, Nebula or another product owns calls and how usage maps to OpenMeter.
- [ ] Build the generative UI data contract: discover schema and allowed fields, query records, filter/sort/page, retrieve updates, and optionally write only under explicit authorization. The current Twenty install does not itself provide the requested product-wide generative UI.

## P2 — Packaging, documentation and developer artifacts

- [ ] Build a versioned, reproducible Prism image containing the branded frontend, modified server and email packages. The current local Compose override mounts `self-host/prism-frontend` into an upstream server image; changes to source alone do not update the running server.
- [ ] Keep secrets in local private configuration; do not commit `self-host/.env` or user/customer data. Preserve database and storage volumes on rebuilds and upgrades. Do not rename Compose projects, volumes, cache prefixes or database namespaces without a migration and recovery plan.
- [ ] `packages/twenty-docker/`, `self-host/docker-compose.yml`, image tags and setup scripts: update deployment documentation only when the actual Prism image and environment exist. Preserve the pinned upstream version and upgrade path.
- [ ] `README.md`, `.github/`, `packages/twenty-website/`, `packages/twenty-docs/`: distinguish upstream Twenty materials from any Prism-facing website/docs. These are separate source packages and are not automatically the running app.
- [ ] Audit only if shipped or made public: `packages/twenty-cli/`, `packages/twenty-sdk/`, `packages/twenty-client-sdk/`, `packages/create-twenty-app/`, `packages/twenty-companion/`, `packages/twenty-zapier/`, `packages/twenty-apps/`, and agent skills. Branding in a real Twenty SDK, package name, marketplace identifier or generated integration may be a compatibility identifier, not a safe global rename.
- [ ] Keep tests, fixtures, migrations, package imports and telemetry/cache identifiers that are technically required; update tests only where intended user-visible behavior changes. Do not edit historical migrations to change branding.

## Verification and completion criteria

- [ ] Confirm approved scope and assets; record any unsupported languages and unresolved product-owner decisions.
- [ ] Run focused frontend, server and email tests for changed behavior; generate and inspect each enabled type of message using a test transport.
- [ ] Build the actual frontend, server, worker and email dependencies; run a fresh instance from the intended Prism image with persistent test storage.
- [ ] In a browser, inspect onboarding, sign-in, settings, records, errors, dashboards/charts/layouts off and on, and representative locales. Verify data survives toggling and restart.
- [ ] Search runtime output, email payloads, frontend assets and relevant API/MCP metadata for unintended customer-facing Twenty names, logos and links. Classify remaining results as justified upstream attribution, compatibility identifiers, third-party references or defects.
- [ ] Verify Nebula-only access with permitted and denied callers and workspace isolation; verify API functionality and feature-gating independently. Review actual outbound requests rather than inferring from a config name.
- [ ] Check a fresh deployment, upgrade and rollback; restore a test backup; verify retained license notices and plan an actual corresponding-source offer where applicable.
- [ ] Record what was tested, what is gated or unavailable, and what still needs legal, translation or visual review. Do not claim a complete rebrand until these checks pass.
