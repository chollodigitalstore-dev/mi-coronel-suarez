// Independent sponsor block. No tracking, autoplay, carousel or external assets.
const hero = document.querySelector('main > .hero');
if (hero && !document.querySelector('#localSponsors')) {
  const style = document.createElement('style');
  style.textContent = `
    #localSponsors{order:2;margin:24px clamp(16px,4vw,64px);padding:26px;background:#102c3b;color:#f5f9fb;border:1px solid #315466;border-radius:20px}
    #localSponsors .sponsor-heading{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:22px}
    #localSponsors .sponsor-heading h2{font:800 23px/1.25 Manrope,sans-serif;letter-spacing:-.5px;margin:5px 0 0;color:#fff}
    #localSponsors .sponsor-label{color:#b9d3e0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
    #localSponsors .sponsor-place{font-size:12px;color:#b9d3e0}
    #localSponsors .sponsor-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
    #localSponsors .sponsor{display:flex;flex-direction:column;align-items:flex-start;min-width:0;padding:4px 24px;border-left:1px solid #375566}
    #localSponsors .sponsor:first-child{border-left:0;padding-left:0}
    #localSponsors .sponsor:last-child{padding-right:0}
    #localSponsors .sponsor-icon{width:42px;height:42px;display:grid;place-items:center;border:1px solid #537483;border-radius:12px;margin-bottom:16px;color:#c5e2ef}
    #localSponsors svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
    #localSponsors h3{font:800 23px/1.2 Manrope,sans-serif;letter-spacing:-.6px;margin:0 0 8px;color:#fff}
    #localSponsors p{font-size:14px;line-height:1.5;color:#c4d6df;margin:0 0 20px}
    #localSponsors .sponsor-contact{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;min-height:48px;margin-top:auto;padding:12px 14px;border:1px solid #7794a3;border-radius:10px;background:#f2f7fa;color:#133d52;font-size:14px;font-weight:700;text-decoration:none}
    #localSponsors .sponsor-contact:hover{background:#dcecf4}
    #localSponsors a:focus-visible{outline:3px solid #a6d8f0;outline-offset:4px}
    body.listing-route-page #localSponsors{display:none}
    @media(max-width:760px){
      #localSponsors{padding:20px;margin:16px;border-radius:16px}
      #localSponsors .sponsor-heading{margin-bottom:8px}
      #localSponsors .sponsor-heading h2{font-size:20px}
      #localSponsors .sponsor-place{display:none}
      #localSponsors .sponsor-grid{grid-template-columns:1fr}
      #localSponsors .sponsor,#localSponsors .sponsor:first-child,#localSponsors .sponsor:last-child{display:grid;grid-template-columns:38px minmax(0,1fr);column-gap:12px;padding:18px 0;border-left:0;border-bottom:1px solid #375566}
      #localSponsors .sponsor:last-child{padding-bottom:0;border-bottom:0}
      #localSponsors .sponsor-icon{grid-row:1/3;width:38px;height:38px;margin:0}
      #localSponsors h3{font-size:20px;margin-bottom:5px}
      #localSponsors p{font-size:13px;margin-bottom:12px}
      #localSponsors .sponsor-contact{grid-column:1/-1;font-size:14px}
    }`;
  document.head.append(style);
  const section = document.createElement('section');
  section.id = 'localSponsors';
  section.setAttribute('aria-labelledby', 'localSponsorsTitle');
  section.innerHTML = `
    <div class="sponsor-heading"><div><span class="sponsor-label">Espacio publicitario</span><h2 id="localSponsorsTitle">Tres propuestas. Acá en Suárez.</h2></div><span class="sponsor-place">Comercios y medios locales</span></div>
    <div class="sponsor-grid">
      <article class="sponsor">
        <span class="sponsor-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 7h14M8 4.5h.01M11 4.5h.01"/><circle cx="12" cy="14" r="4"/><path d="M9 14c2-2 4 2 6 0"/></svg></span>
        <h3>La Reja Reparaciones</h3><p>Reparación de electrodomésticos.</p>
        <a class="sponsor-contact" href="tel:+542926516921" aria-label="Llamar a La Reja Reparaciones al 2926 516921"><span>2926 516921</span><span>Llamar ↗</span></a>
      </article>
      <article class="sponsor">
        <span class="sponsor-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 7v10l9-5zM4 5a10 10 0 0 0 0 14M20 5a10 10 0 0 1 0 14"/></svg></span>
        <h3>Radio Play <span>FM 95.3</span></h3><p>Coronel Suárez, también online.</p>
        <a class="sponsor-contact" href="https://radioplay953.com.ar/" target="_blank" rel="noopener noreferrer" aria-label="Abrir Radio Play FM 95.3 en una pestaña nueva"><span>Escuchá Radio Play</span><span aria-hidden="true">↗</span></a>
      </article>
      <article class="sponsor">
        <span class="sponsor-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><ellipse cx="10" cy="13" rx="7" ry="4"/><path d="M3 13v5c0 5 14 5 14 0v-5M15 2l6 7M11 3l9 9"/><ellipse cx="10" cy="13" rx="2" ry="1"/></svg></span>
        <h3>Minami Sushi Bar</h3><p>Tu próxima elección de sushi.</p>
        <a class="sponsor-contact" href="tel:+542926547663" aria-label="Llamar a Minami Sushi Bar al 2926 547663"><span>2926 547663</span><span>Llamar ↗</span></a>
      </article>
    </div>`;
  hero.after(section);
}
