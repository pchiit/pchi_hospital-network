/*  hospitalListEmbed.js  – June 2025
    ------------------------------------------------------------
    ▸ Place this file next to hospitals.html in your GitHub repo.
    ▸ Embed in Webflow:
         <div id="hospital-network-container"></div>
         <script src="https://cdn.jsdelivr.net/gh/ahmedhadrich/PCIL_Scripts@latest/hospitalListEmbed.js" defer></script>
*/

(function () {
  /* ---------- config ---------- */
  const containerId = 'hospital-network-container';
  const htmlSrc = new URL('hospitals.html', document.currentScript.src).href;

  /* ---------- container ---------- */
  let host = document.getElementById(containerId);
  if (!host) {
    host = document.createElement('div');
    host.id = containerId;
    document.currentScript.before(host);
  }

  /* ---------- fetch + inject ---------- */
  fetch(htmlSrc)
    .then(r => r.text())
    .then(html => {
      host.innerHTML = html;

      /* 1. Move any <style> blocks to <head> so CSS applies */
      host.querySelectorAll('style').forEach(sty => {
        document.head.appendChild(sty.cloneNode(true));
        sty.remove();
      });

      /* 2. Run inline <script> tags (tabs logic) */
      host.querySelectorAll('script').forEach(scr => {
        try { new Function(scr.textContent)(); } catch (e) { console.error(e); }
        scr.remove();
      });

      /* 3. Fix legacy typo herf= on map links, if any */
      host.querySelectorAll('a[herf]').forEach(a => {
        a.setAttribute('href', a.getAttribute('herf'));
        a.removeAttribute('herf');
      });

      /* 4. Safety-net tab wiring (if inline JS was blocked) */
      const tabs = host.querySelectorAll('.hospital-tab');
      const regions = host.querySelectorAll('.region');
      if (tabs.length && regions.length) {
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.toggle('active', t === tab));
            // Update active region using class instead of inline style
            regions.forEach(r => {
              r.classList.toggle('active', r.id === 'reg-' + tab.dataset.region);
            });
          });
        });
      }

      /* 5. Ensure Font Awesome loads for the red pin icon */
      if (!document.getElementById('fa-hospital-network')) {
        const fa = document.createElement('link');
        fa.id = 'fa-hospital-network';
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
        document.head.appendChild(fa);
      }
    })
    .catch(err => {
      console.error('hospitalListEmbed:', err);
      host.innerHTML = '<p style="color:red">Unable to load hospital list. Please try again later.</p>';
    });
})();
