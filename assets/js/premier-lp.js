/* ==========================================================================
   PREMIER WINDOWS — LANDING PAGE JAVASCRIPT
   Shared, dependency-free script for Premier campaign / Google Ads pages.
   Loaded with `defer`. Extracted verbatim from the approved concept.

   Handles: 2-step quote form(s) + validation, telephone-click tracking,
   GA4 events, Google Ads conversions, success-page redirect, footer year.

   Supports MULTIPLE quote forms on one page (e.g. hero + final CTA). Every
   form is wired independently with form-scoped lookups so they submit
   identically. The hero form keeps id="quoteForm" for backward compatibility;
   any additional form opts in with the [data-quote-form] attribute.

   ─────────────────────────────────────────────────────────────────────────
   DEV TODO — dev supplies these later (see the TRACKING block below):
     1. AW_CONVERSION_ID / AW_LEAD_LABEL / AW_CALL_LABEL   (Google Ads)
     2. GA4_ID                                             (in the page <head>)
     3. ENDPOINT — real form endpoint (+ server-side validation/spam check)
     4. SUCCESS_URL — confirm the thank-you page exists
   The gtag() bootstrap + GA4_ID/AW_CONVERSION_ID placeholders live inline in
   the page <head> so they load first; this file only reads them.
   ========================================================================== */
(function(){
  "use strict";

  /* ===========================================================================
     TRACKING CONFIG — the only block the developer needs to edit.
     =========================================================================== */
  var TRACKING = {
    AW_CONVERSION_ID : 'AW_CONVERSION_ID',   /* TODO: 'AW-123456789'            */
    AW_LEAD_LABEL    : 'AW_LEAD_LABEL',      /* TODO: form-submit conversion label */
    AW_CALL_LABEL    : 'AW_CALL_LABEL',      /* TODO: phone-click conversion label */
    SUCCESS_URL      : '/thank-you/',        /* thank-you page (live)             */
    REDIRECT_ON_SUCCESS : true,              /* false → show inline success instead */
    ENDPOINT         : '/api/quote'          /* TODO: real form endpoint          */
  };

  /* Google Ads conversion */
  function adsConversion(label, extra){
    if (typeof gtag !== 'function') return;
    gtag('event','conversion', Object.assign({
      'send_to': TRACKING.AW_CONVERSION_ID + '/' + label
    }, extra || {}));
  }
  /* GA4 event */
  function ga4(name, params){
    if (typeof gtag === 'function') gtag('event', name, params || {});
    if (window.dataLayer) window.dataLayer.push(Object.assign({event:name}, params||{}));
  }

  /* --- TELEPHONE CLICK TRACKING (every tel: link on the page) --- */
  document.querySelectorAll('[data-track="phone"]').forEach(function(el){
    el.addEventListener('click', function(){
      ga4('phone_call_click', {link_url:'tel:1300596405', location:el.closest('section,header,footer,div').className||'page'});
      adsConversion(TRACKING.AW_CALL_LABEL);
    });
  });

  /* --- SECONDARY CTA (showroom) --- */
  document.querySelectorAll('[data-track="showroom"]').forEach(function(el){
    el.addEventListener('click', function(){ ga4('showroom_visit_click'); });
  });

  /* --- FOOTER YEAR --- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* --- SHARED FIELD VALIDATION --- */
  function validate(input){
    var wrap = input.closest('.field'), v = input.value.trim(), ok = !!v;
    if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (ok && input.type === 'tel')   ok = v.replace(/\D/g,'').length >= 8;
    wrap.classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  /* --- QUOTE FORM ---
     Wire a single quote form. Every lookup is scoped to `form` so multiple
     forms on one page never collide. The hero form identifies its step
     controls by id (#toStep2 / #backTo1); additional forms use the
     [data-next] / [data-back] attributes to avoid duplicate ids. */
  function initQuoteForm(form){
    var step1     = form.querySelector('[data-step="1"]');
    var step2     = form.querySelector('[data-step="2"]');
    var next      = form.querySelector('#toStep2, [data-next]');
    var back      = form.querySelector('#backTo1, [data-back]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var success   = (form.closest('.fcard') || document).querySelector('.success');
    if (!step1 || !step2 || !next || !back || !submitBtn) return;

    next.addEventListener('click', function(){
      step1.hidden = true; step2.hidden = false;
      ga4('quote_step_1_complete', {
        replacing: form.replacing ? form.replacing.value : '',
        qty:       form.qty ? form.qty.value : ''
      });
      var f = step2.querySelector('input'); if (f) f.focus();
    });

    back.addEventListener('click', function(){
      step2.hidden = true; step1.hidden = false;
    });

    step2.querySelectorAll('input').forEach(function(i){
      i.addEventListener('blur',  function(){ if (i.value.trim()) validate(i); });
      i.addEventListener('input', function(){ if (i.closest('.field').classList.contains('invalid')) validate(i); });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();

      var valid = true;
      step2.querySelectorAll('input[required]').forEach(function(i){ if(!validate(i)) valid = false; });
      if (!valid){
        var bad = step2.querySelector('.field.invalid input');
        if (bad) bad.focus();
        ga4('quote_form_error');
        return;
      }

      var data = Object.fromEntries(new FormData(form).entries());
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      /* --- FORM SUBMISSION TRACKING (fires on successful lead) --- */
      function onSuccess(){
        ga4('generate_lead', {
          replacing: data.replacing,
          qty: data.qty,
          suburb: data.suburb,
          value: 1,
          currency: 'AUD'
        });
        adsConversion(TRACKING.AW_LEAD_LABEL, {value:1, currency:'AUD'});

        /* --- SUCCESS PAGE REDIRECT --- */
        if (TRACKING.REDIRECT_ON_SUCCESS) {
          /* small delay lets the conversion beacon fire before navigation */
          setTimeout(function(){ window.location.href = TRACKING.SUCCESS_URL; }, 350);
        } else if (success) {
          form.hidden = true;
          success.hidden = false;
          success.scrollIntoView({block:'center', behavior:'smooth'});
        }
      }

      /* TODO(dev): real submission. Server MUST validate + spam-check.
         fetch(TRACKING.ENDPOINT, {
           method:'POST',
           headers:{'Content-Type':'application/json'},
           body: JSON.stringify(data)
         })
         .then(function(r){ if(!r.ok) throw new Error('Bad response'); onSuccess(); })
         .catch(function(){
           submitBtn.disabled = false;
           submitBtn.textContent = 'Get my free quote →';
           ga4('quote_form_submit_failed');
         });
      */
      onSuccess(); /* placeholder — remove once the fetch above is live */
    });
  }

  /* Wire the hero form (#quoteForm) plus any additional [data-quote-form]. */
  var forms = document.querySelectorAll('#quoteForm, [data-quote-form]');
  if (forms.length) ga4('view_quote_form');
  forms.forEach(initQuoteForm);
})();
