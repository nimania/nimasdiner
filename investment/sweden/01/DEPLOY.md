# Sweden / 01 — intake deployment checklist

The GitHub Pages form is static. Successful submission requires **both** separately deployed server components:

1. Deploy the updated `backend/Code.gs` as a new version of the existing Google Apps Script web app. Preserve the existing script properties, private spreadsheet, existing triggers, and owner permissions. Confirm that `api_investment` is enabled on the deployed `/exec` URL.
2. Deploy the updated `services/delivery/worker/index.js` to the existing Cloudflare Worker at `nimasdiner-delivery.iran.chatgpt.site`. The upstream URL in the Worker must still point to the deployed Apps Script web app. Preserve the existing book-delivery endpoints.
3. Confirm the GitHub Pages build includes `investment/sweden/01/index.html` and `investment/sweden/01/form.js`.
4. Submit a **test-only** form with invented answers and an email address you control. Verify the submission returns `ok:true`, a TXT copy downloads, the private spreadsheet gets one row in `InvestmentIntake`, and the owner's existing mail queue gets an alert. Retry the same submission ID and verify no duplicate row.
5. Confirm that the owner email is sent by the existing queue processor (which depends on its time trigger and available quota). A successful client response confirms private storage, **not** successful email delivery.
6. Verify request failures do not show a success message or discard locally saved answers. Test a mobile browser.

Security limitations: the form is a public unlisted page, not password protected. Data is saved in localStorage prior to submission and sent to the private Apps Script sheet only via the Worker after consent. Avoid IDs, bank information, and sensitive documents in this public intake. The origin header is not an authentication mechanism; add rate limiting or bot protection before widely distributing this endpoint. The backend should not log payloads.
