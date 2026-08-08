# Security — The Crest Guild

**Last updated:** 8 August 2026

This page describes the technical and organisational measures ArmoFlow Ltd uses to keep thecrestguild.com and the application process secure. The Crest Guild currently runs on simpler infrastructure than FrostDesk (no user accounts, no database of customer messages), and this page reflects that accurately rather than describing measures that don't yet apply here.

## 1. Infrastructure and hosting

- thecrestguild.com is a static website hosted on **Vercel**.
- Application and quiz-result submissions are handled by **Formspree**, a third-party form-processing service (note: FrostDesk/armoflow.com uses Resend for this — The Crest Guild specifically uses Formspree). We do not run our own database of applications at this time. [DA CONFERMARE se in futuro verrà introdotto un sistema di gestione candidature con database proprio — questa pagina andrà aggiornata di conseguenza]
- Source code is version-controlled via GitHub, with access restricted to authorised team members.

## 2. Encryption

- All traffic between your browser and thecrestguild.com is encrypted via HTTPS/TLS (provided by Vercel).
- We do not currently store personal data in our own database — submitted form/application data is transmitted securely to Formspree, which maintains its own security programme (see formspree.io/legal/privacy-policy).
- Payment data, once a paid stage of the programme is live, will never be stored on our own servers — payment processing will be handled by a PCI-DSS compliant provider. [DA CONFERMARE quando il pagamento sarà attivo]

## 3. Access control

- Access to the website's source repository and hosting/deployment configuration is restricted to authorised ArmoFlow personnel on a least-privilege basis.
- We use unique credentials and, where supported, multi-factor authentication (MFA) for access to GitHub and Vercel.
- The Crest Guild does not currently have user accounts or passwords for applicants/Members — access to the application form does not require authentication. [DA CONFERMARE se in futuro verrà introdotta un'area membri con login]

## 4. Monitoring and incident response

- We maintain a general incident response process covering identification, containment, investigation, notification, and remediation of security incidents.
- In the event of a personal data breach that poses a risk to individuals, we will notify the ICO within 72 hours where required by UK GDPR, and notify affected individuals without undue delay.
- We do not currently run dedicated error/performance monitoring tooling on The Crest Guild (FrostDesk uses Sentry for this); this may be added as the Service grows. [DA CONFERMARE]

## 5. Third-party risk management

We select third-party providers (currently: Vercel for hosting, Formspree for form processing, Google Analytics for website analytics) and review their security and data protection commitments before integration. A current list is available in our Privacy Policy.

## 6. Data minimisation

We collect only the data needed to evaluate applications, deliver quiz results, and run the website — see our Privacy Policy for full detail.

## 7. Secure development practices

- Changes to the website are reviewed before deployment to production.
- Access to the source repository and deployment pipeline is restricted and logged via GitHub and Vercel's own access controls.

## 8. Reporting a security issue

If you discover a security vulnerability or have concerns about the security of thecrestguild.com, please contact us at **hello@armoflow.com**. We take all reports seriously and will investigate promptly. We ask that you report responsibly and avoid accessing or modifying data that isn't yours.

## 9. Contact

ArmoFlow Ltd
Email: **hello@armoflow.com**
Registered address: 167-169 Great Portland Street, London, England, W1W 5PF
