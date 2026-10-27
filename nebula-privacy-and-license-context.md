# Nebula privacy, agreements, and Prism license context

Last updated: 2026-10-26

## Product context

Prism is planned as an internal component or engine inside Nebula. Nebula is intended to be the public-facing product; Orbit, Gravity and other components may sit alongside or support it. The final deployment architecture, integrations and data flows are not yet confirmed.

The product owner's direction is to handle customer-facing privacy and terms at the **Nebula level**, rather than create a separate Prism privacy policy or separate Prism terms solely because Prism is a component. This is a product decision, not a determination that any particular notice or agreement is legally sufficient.

## Guidance for future agents

When designing, implementing or documenting Prism features:

1. Identify what personal or customer data the feature receives, creates, stores, uses, deletes or shares; where it is processed; and which external providers, model providers or other subprocessors receive it. Do not assume a provider or data flow is in use without verifying it.
2. Record changes that may need to be reflected in **Nebula's privacy notice**, customer terms, and any applicable data-processing agreement, subprocessor disclosures or other agreements. Describe actual behavior, not intended behavior presented as implemented.
3. Flag questions about legal requirements to the product owner for jurisdiction-specific legal review. Whether a particular notice, term or agreement is needed depends on the service, parties, jurisdictions and data processing. Do not invent legal language, operators, contact details, policies or commitments.
4. Do not reuse Twenty's terms, privacy policy or data-processing agreement as if they were Nebula's or Prism's. Do not rename parties in a pre-signed or existing agreement. If Prism screens or emails require a future policy link, hide it or use a clearly inactive placeholder until the real Nebula destination is supplied.
5. Coordinate customer-facing privacy and terms at the Nebula level when warranted. A separate public-facing Prism legal page is not assumed necessary. This does not eliminate any applicable privacy, contractual or security obligation.

## Separate question: Twenty and other software licenses

Prism is a modified fork of Twenty. Preserve the applicable copyright notices, license texts, third-party notices, and commercial-license boundaries in the repository and applicable distributions. The Twenty name and logo are trademarks; truthful upstream attribution is distinct from using them as Prism branding.

The main Twenty code is generally AGPLv3, with separately identified MIT packages and commercially licensed Enterprise files. Twenty's application exception can permit certain independent applications that interact through its defined interfaces to use their own license; it does not remove the AGPL from modifications to Twenty itself. A modified program's remote users may need to be offered its corresponding source under AGPLv3 section 13.

Whether Nebula users interact with the modified Twenty-based service in a way that triggers a source offer, and what code is corresponding source, depends on the actual architecture and use. Do not assume that placing Prism behind Nebula automatically removes the obligation or automatically subjects all Nebula code to AGPL. Have qualified counsel review the final architecture and release model before outside use. Do not publish source or make external changes without the user's authorization.

## References

- Twenty license for the version used by this checkout: https://github.com/twentyhq/twenty/blob/twenty/v2.51.0/LICENSE
- Twenty trademark policy: https://github.com/twentyhq/twenty/blob/twenty/v2.51.0/.github/TRADEMARK.md
- GNU license FAQ: https://www.gnu.org/licenses/gpl-faq.en.html
- ICO guidance on presenting privacy information, relevant where applicable: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-methods-can-we-use-to-provide-privacy-information/
- Local rebrand inventory: `rebrand targets.md`
