# Private Gmail delivery backend

Status: live. Google authorization and setup completed; web app deployed as owner with Anyone access. The public form posts to Apps Script. Live test verified confirmation email, confirmation POST, book email, private file response and recorded request count. Public PDF removed from the current published tree.

Web app: https://script.google.com/macros/s/AKfycbyXa2319CfBEm2_CPmtSyymm1uLYZ1kMsOL18FrQG_GTD_ObbemQTUPjjhHltF7fI2Q/exec

The remaining numbered steps document the setup/cutover procedure, already completed.

Apps Script project: https://script.google.com/home/projects/1O_5QIjbkg7e52Vualbjqta8QZjNtZATyDfq9qF2rLPO-pXYN-STtPIfG/edit

1. Review and authorize `setup` as nimania@gmail.com. It creates a private Google Sheet, accesses the private book in Drive, and installs a 15-minute mail queue trigger.
2. Run setup and retain the private Sheet URL from the execution log. Subscribers has filterable pending/confirmed status, profile fields, consent, first file request and request count; Queue reports mail delivery attempts. A file request does not establish that a reader saved the PDF.
3. Deploy a versioned web app, executing as the owner, with public endpoint access. Test registration, confirmation POST and private PDF delivery with an owner-controlled address.
4. Only after a successful live test: change the public form action to the `/exec` URL, remove FormSubmit hidden configuration, retain the honeypot and add action=register. Update privacy.html to describe Google Sheets/Drive and Gmail. Replace download.html with an instruction to use the emailed private link, and remove assets/restaurant-handbook.pdf from the current published tree.
5. Validate the published form, mobile/RTL response pages, queue, Sheet statuses and expiry/invalid-token handling. The former public PDF remains recoverable from Git history; this is email-gated delivery, not DRM.

Only name and email are required. Marketing updates require explicit yes consent. Confirmation links expire in 7 days; download links in 90 days, with a 30-request cap. Registration cap: 60/day. Queue sends at most ten messages per execution while reserving 15 recipients of available Google quota; queued mail may be delayed. Failed jobs stop after five attempts and require owner review.

Test: `node backend/tests/flow.cjs` (mock services, no real email).

No account password, OAuth token or API secret is stored in this repository.
