import { t } from './store';
import { esc } from './util';
import { LINKS } from './config';
import { track } from './analytics';

/** Posts to the Vercel Function /api/contact (api/contact.ts), which sends the mail via Resend. */
export function contactFormHTML(variant: 'cv' | 'game') {
  const f = t().form;
  return `
  <form class="cform cform--${variant}" name="contact" method="POST" action="/api/contact" novalidate>
    <input type="hidden" name="source" value="${variant}">
    <p class="cform__hp" aria-hidden="true"><label>Leave empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <div class="cform__row">
      <label class="cform__field"><span>${esc(f.name)}</span><input name="name" required autocomplete="name" maxlength="120"></label>
      <label class="cform__field"><span>${esc(f.email)}</span><input name="email" type="email" required autocomplete="email" maxlength="200"></label>
    </div>
    <label class="cform__field"><span>${esc(f.message)}</span><textarea name="message" rows="5" required maxlength="5000"></textarea></label>
    <div class="cform__foot">
      <button type="submit" class="cform__send">${esc(f.send)}</button>
      <p class="cform__note">${esc(f.privacy)} <a href="/datenschutz.html">${esc(f.privacyLink)}</a>.</p>
    </div>
    <p class="cform__status" role="status" aria-live="polite"></p>
  </form>`;
}

export function bindContactForm(root: ParentNode) {
  root.querySelectorAll<HTMLFormElement>('form.cform').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = t().form;
      const status = form.querySelector<HTMLElement>('.cform__status')!;
      const btn = form.querySelector<HTMLButtonElement>('.cform__send')!;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true; btn.textContent = f.sending; status.textContent = ''; status.dataset.state = '';
      try {
        const body = JSON.stringify(Object.fromEntries(new FormData(form) as any));
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.textContent = f.ok; status.dataset.state = 'ok';
        track('Contact Submitted', { source: (form.elements.namedItem('source') as HTMLInputElement).value });
      } catch {
        status.innerHTML = `${esc(f.err)} <a href="mailto:${LINKS.email}">${LINKS.email}</a>`; status.dataset.state = 'err';
      } finally {
        btn.disabled = false; btn.textContent = f.send;
      }
    });
    // Keep game keyboard controls from firing while typing.
    form.addEventListener('keydown', (e) => e.stopPropagation());
  });
}
