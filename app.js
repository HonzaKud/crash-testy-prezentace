'use strict';
(() => {
  const slides = Array.isArray(window.SLIDES) ? window.SLIDES : [];
  const school = window.SCHOOL || {};
  const $ = id => document.getElementById(id);
  const stage = $('slide');
  document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); stage.focus(); });
  if (!slides.length) { stage.textContent = 'Prezentaci se nepodařilo načíst. Obnov stránku.'; return; }
  let current = 0;
  const totalTime = slides.reduce((sum, slide) => sum + (Number(slide.time) || 0), 0);
  const time = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  const el = (tag, className, text) => { const item = document.createElement(tag); if (className) item.className = className; if (text !== undefined) item.textContent = text; return item; };
  function list(items) { const ul = el('ul', 'bullet-list'); (items || []).forEach(item => ul.append(el('li', '', item))); return ul; }
  function link(label, url, className) { const a = el('a', className, label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
  const svgs = {
    car: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 370" role="img" aria-label="Ilustrační schéma karoserie: příď pohlcuje energii, kabina zachovává prostor"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" class="diagram-grid"/></pattern></defs><rect width="600" height="370" fill="url(#grid)"/><path d="M55 250V200L100 184 175 175 240 103H382L452 177 533 194 553 250H493M155 250H398" class="diagram-line"/><path d="M205 175 253 118H372L423 175Z" fill="#d1ed5717" stroke="#d1ed57" stroke-width="3"/><path d="M298 118V175M430 186V240M193 185V240" class="diagram-line"/><circle cx="115" cy="250" r="38" fill="#101923" stroke="#f2f1e8" stroke-width="3"/><circle cx="115" cy="250" r="18" class="diagram-line"/><circle cx="447" cy="250" r="38" fill="#101923" stroke="#f2f1e8" stroke-width="3"/><circle cx="447" cy="250" r="18" class="diagram-line"/><path d="M59 208H165M60 224H160M73 240H160" stroke="#ff9a71" stroke-width="5" stroke-dasharray="7 6"/><path d="M33 150H106M89 138 106 150 89 162" class="diagram-accent"/><path d="M115 179V68H30M305 100V48H485" fill="none" stroke="#83939f" stroke-width="1.5"/><text x="30" y="54" class="technical-label">Deformační zóna</text><text x="315" y="34" class="technical-label">Chráněný prostor kabiny</text><path d="M60 320H546" stroke="#536371" stroke-width="1"/><text x="65" y="348" class="technical-label">Pohltit energii.</text><text x="330" y="348" class="technical-label">Zachovat prostor.</text></svg>`,
    energy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Při stejné hmotnosti má auto ve 100 kilometrech za hodinu čtyřnásobnou kinetickou energii oproti 50"><path d="M55 294H550" class="diagram-line"/><rect x="94" y="235" width="125" height="59" fill="#82b9d7"/><rect x="339" y="58" width="125" height="236" fill="#d1ed57"/><text x="109" y="221" class="technical-label">1× energie</text><text x="350" y="42" class="technical-label">4× energie</text><text x="89" y="329" class="technical-label">50 km/h</text><text x="331" y="329" class="technical-label">100 km/h</text><path d="M240 183H312M295 171 312 183 295 195" class="diagram-line"/><text x="75" y="82" fill="#f2f1e8" font-size="28" font-family="Arial">E = ½ m v²</text></svg>`,
    occupant: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" role="img" aria-label="Ilustrační schéma: pás vede přes rameno a pánev, airbag doplňuje jeho funkci"><path d="M160 67V236Q160 265 191 265H368M145 280H376M183 280V323M339 280V323" class="diagram-line"/><circle cx="263" cy="115" r="35" fill="#82b9d722" stroke="#82b9d7" stroke-width="3"/><path d="M245 151 230 220 306 228 350 290H406M287 157 315 197 364 195" class="diagram-line"/><path d="M207 116 305 227 226 234" class="diagram-accent"/><path d="M409 155 392 216M386 219H424" class="diagram-line"/><ellipse cx="358" cy="143" rx="49" ry="40" fill="#d1ed5716" stroke="#d1ed57" stroke-width="3" stroke-dasharray="7 5"/><path d="M241 184H71M347 103V46H472" fill="none" stroke="#83939f" stroke-width="1.5"/><text x="30" y="172" class="technical-label">Bezpečnostní pás</text><text x="370" y="32" class="technical-label">Airbag</text><text x="120" y="360" class="technical-label">Spolupracující zádržný systém</text></svg>`,
    pedestrian: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" role="img" aria-label="Ilustrační schéma ochrany chodce: nárazník, kapota a prostor pod kapotou ovlivňují zatížení těla"><path d="M40 274V206Q115 186 253 184L325 232V274H277M126 274H225" class="diagram-line"/><circle cx="87" cy="274" r="37" fill="#101923" stroke="#f2f1e8" stroke-width="3"/><path d="M56 193Q151 159 252 174" class="diagram-accent"/><path d="M68 210H241" stroke="#82b9d7" stroke-width="3" stroke-dasharray="6 5"/><circle cx="422" cy="75" r="26" fill="#82b9d722" stroke="#82b9d7" stroke-width="3"/><path d="M420 102 401 182 436 230 423 302M403 183 372 240 363 300M411 136 371 171M414 133 455 171" class="diagram-line"/><path d="M265 180Q320 108 388 84M374 75 389 84 378 98" class="diagram-accent"/><path d="M145 168V87H35M303 232H350" fill="none" stroke="#83939f" stroke-width="1.5"/><text x="30" y="70" class="technical-label">Kapota a prostor pod ní</text><text x="267" y="337" class="technical-label">Konstrukce + prevence nárazu</text></svg>`,
    repair: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Tři oblasti správné opravy: konstrukce, diagnostika a kalibrace"><path d="M95 100H510M95 180H510M95 260H510" class="diagram-grid"/><g fill="none" stroke="#d1ed57" stroke-width="3"><circle cx="65" cy="100" r="20"/><path d="m55 100 7 7 13-15"/><circle cx="65" cy="180" r="20"/><path d="m55 180 7 7 13-15"/><circle cx="65" cy="260" r="20"/><path d="m55 260 7 7 13-15"/></g><g fill="#f2f1e8" font-size="27" font-family="Arial"><text x="110" y="108">Konstrukce a materiály</text><text x="110" y="188">Diagnostika systémů</text><text x="110" y="268">Kontroly a kalibrace</text></g><text x="45" y="335" class="technical-label">Vždy podle postupu výrobce vozidla.</text></svg>`
  };
  function visual(name) {
    const box = el('figure', 'visual');
    const svg = new DOMParser().parseFromString(svgs[name] || svgs.car, 'image/svg+xml').documentElement;
    box.append(document.importNode(svg, true), el('figcaption', 'visual-caption', name === 'energy' ? 'Stejná hmotnost · ilustrační porovnání kinetické energie' : 'Výukové schéma · není konstrukční ani servisní výkres'));
    return box;
  }
  function showSources(sources, full) {
    const box = el('div', full ? 'sources-list' : 'slide-sources');
    (sources || []).forEach(source => { const a = link(source.label, source.url); if (full) { try { a.append(el('small', '', new URL(source.url).hostname)); } catch {} } box.append(a); });
    return box;
  }
  function video(slide) {
    const layout = el('div', 'video-layout');
    const column = el('div');
    const screen = el('div', 'video-stage');
    const button = el('button', 'video-load'); button.type = 'button';
    button.append(el('span', 'play-icon', '▶'), el('strong', '', 'Načíst krátkou ukázku'), el('small', '', `${slide.video.label || 'Video'} · úsek ${time(slide.video.start || 0)}–${time(slide.video.end || 0)}. Po načtení spusť přehrávač. YouTube vyžaduje internet.`));
    button.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      const params = new URLSearchParams({ start: String(slide.video.start || 0), end: String(slide.video.end || 0), rel: '0', playsinline: '1' });
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(slide.video.id)}?${params}`;
      frame.title = slide.video.label || slide.title;
      frame.allow = 'encrypted-media; picture-in-picture; fullscreen'; frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      screen.replaceChildren(frame);
    });
    screen.append(button);
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(slide.video.id)}&t=${slide.video.start || 0}s`;
    column.append(screen, link('Otevřít na YouTube ↗ · když vložené video nefunguje', url, 'video-link'));
    const observe = el('div', 'video-observe'); observe.append(el('span', 'eyebrow', 'PŘI SLEDOVÁNÍ SI VŠIMNI'), list(slide.bullets));
    layout.append(column, observe); return layout;
  }
  function render(index, focus = false) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[current];
    stage.replaceChildren(); stage.className = slide.kind || 'standard';
    const meta = el('div', 'slide-meta'); meta.append(el('span', 'eyebrow', slide.kicker || 'Crash testy'), el('span', 'duration', slide.time ? `${time(slide.time)} na snímek` : 'Další studium'));
    stage.append(meta);
    if (slide.kind === 'video' && slide.video) {
      stage.append(el('h2', '', slide.title), el('p', 'lead', slide.lead), video(slide));
    } else {
      const hasVisual = slide.visual && !['quiz', 'summary', 'sources'].includes(slide.kind);
      const layout = el('div', hasVisual ? 'slide-layout' : '');
      const text = el('div', 'text-column');
      const heading = el(slide.kind === 'intro' ? 'h1' : 'h2', '', slide.title);
      const lead = el('p', 'lead', slide.lead);
      if (hasVisual && slide.kind !== 'intro') {
        stage.append(heading);
        if (slide.lead) stage.append(lead);
      } else {
        text.append(heading);
        if (slide.lead) text.append(lead);
      }
      text.append(list(slide.bullets));
      if (slide.kind === 'intro') {
        const presenter = el('div', 'presenter');
        if (school.logo) { const image = el('img', 'school-logo'); image.src = school.logo; image.alt = 'Logo školy'; image.addEventListener('error', () => image.remove(), { once: true }); presenter.append(image); }
        const info = el('div'); info.append(el('span', 'presenter-name', 'Ivan Kudrna'), link(school.name || '', school.url || 'https://www.isstbn.cz/', 'school-name')); presenter.append(info); text.append(presenter);
      }
      if (slide.kind === 'quiz') {
        const button = el('button', 'answer-toggle', 'Odhalit odpovědi'); button.type = 'button'; button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', 'quiz-answers');
        const answers = el('div', 'answers'); answers.id = 'quiz-answers'; answers.hidden = true;
        (slide.answers || [slide.notes]).forEach(answer => answers.append(el('p', '', answer)));
        button.addEventListener('click', () => { answers.hidden = !answers.hidden; button.setAttribute('aria-expanded', String(!answers.hidden)); button.textContent = answers.hidden ? 'Odhalit odpovědi' : 'Skrýt odpovědi'; });
        text.append(button, answers);
      }
      if (slide.kind === 'sources') text.append(showSources(slide.sources, true));
      layout.append(text); if (hasVisual) layout.append(visual(slide.visual)); else stage.classList.add('no-visual'); stage.append(layout);
    }
    if (slide.kind !== 'sources' && slide.sources) stage.append(showSources(slide.sources, false));
    $('counter').textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
    $('section-label').textContent = slide.kicker || 'Crash testy';
    $('prev').disabled = current === 0; $('next').disabled = current === slides.length - 1;
    $('progress-fill').style.width = `${(current + 1) / slides.length * 100}%`;
    document.querySelector('.progress').setAttribute('aria-valuenow', String(current + 1));
    document.querySelector('.progress').setAttribute('aria-valuemax', String(slides.length));
    $('notes-text').textContent = slide.notes || '';
    const start = slides.slice(0, current).reduce((sum, item) => sum + (Number(item.time) || 0), 0);
    $('plan').textContent = slide.time ? `Plán ${time(start)}–${time(start + slide.time)} / ${time(totalTime)}` : 'Mimo čas výkladu';
    document.title = `${current + 1}. ${slide.title} — Crash testy`;
    const hash = `#${current + 1}`; if (location.hash !== hash) history.replaceState(null, '', hash);
    document.querySelectorAll('#overview-grid button').forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
    if (focus) { stage.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
  }
  const fromHash = () => { const parsed = /^#(\d+)$/.exec(location.hash); return parsed ? Math.max(0, Math.min(slides.length - 1, Number(parsed[1]) - 1)) : 0; };
  $('prev').addEventListener('click', () => render(current - 1, true));
  $('next').addEventListener('click', () => render(current + 1, true));
  const notesToggle = () => { $('notes').hidden = !$('notes').hidden; $('notes-btn').setAttribute('aria-pressed', String(!$('notes').hidden)); };
  $('notes-btn').addEventListener('click', notesToggle);
  const overview = $('overview');
  function openOverview() { if (!overview.open) { overview.showModal(); const active = document.querySelector('#overview-grid button[aria-current=true]'); if (active) active.focus(); } }
  $('overview-btn').addEventListener('click', openOverview);
  $('close-overview').addEventListener('click', () => overview.close());
  $('overview-duration').textContent = `${slides.length} snímků · plán výkladu ${time(totalTime)} včetně videí`;
  slides.forEach((slide, i) => { const button = el('button'); button.type = 'button'; button.append(el('span', '', `${String(i + 1).padStart(2, '0')} / ${slide.time ? time(slide.time) : 'ZDROJE'}`), document.createTextNode(slide.title)); button.addEventListener('click', () => { overview.close(); render(i, true); }); $('overview-grid').append(button); });
  async function fullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('status').textContent = 'Celá obrazovka není v tomto prohlížeči dostupná. Použij F11.'; } }
  $('fullscreen-btn').addEventListener('click', fullscreen);
  document.addEventListener('fullscreenchange', () => { $('fullscreen-btn').textContent = document.fullscreenElement ? 'Ukončit celou obrazovku' : 'Celá obrazovka'; });
  let accumulated = 0, started = null;
  function elapsed() { return accumulated + (started === null ? 0 : performance.now() - started); }
  function updateTimer() { $('elapsed').textContent = time(Math.floor(elapsed() / 1000)); }
  $('timer-toggle').addEventListener('click', () => { if (started === null) { started = performance.now(); $('timer-toggle').textContent = 'Pozastavit'; } else { accumulated = elapsed(); started = null; $('timer-toggle').textContent = 'Pokračovat'; } updateTimer(); });
  $('timer-reset').addEventListener('click', () => { accumulated = 0; started = null; $('timer-toggle').textContent = 'Spustit čas'; updateTimer(); });
  setInterval(updateTimer, 500);
  function preparePrint() {
    const container = $('print-slides'); container.replaceChildren();
    slides.forEach((slide, i) => {
      const page = el('section'); page.append(el('p', 'eyebrow', `${i + 1} / ${slides.length} · ${slide.kicker || 'Crash testy'}`), el('h2', '', slide.title), el('p', 'lead', slide.lead), list(slide.bullets));
      if (slide.answers) { const answers = el('div', 'print-notes'); slide.answers.forEach(answer => answers.append(el('p', '', answer))); page.append(answers); }
      if (slide.video) { const url = `https://www.youtube.com/watch?v=${encodeURIComponent(slide.video.id)}&t=${slide.video.start || 0}s`; page.append(link(`Video: ${slide.video.label || slide.title} · ${time(slide.video.start || 0)}–${time(slide.video.end || 0)}`, url)); }
      if (slide.sources) page.append(showSources(slide.sources, false));
      if (!$('notes').hidden && slide.notes) page.append(el('p', 'print-notes', slide.notes));
      container.append(page);
    });
  }
  $('print-btn').addEventListener('click', () => { preparePrint(); window.print(); });
  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('hashchange', () => { if (/^#\d+$/.test(location.hash)) render(fromHash(), true); });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || overview.open || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (/^(BUTTON|A)$/.test(event.target.tagName) && [' ', 'Enter'].includes(event.key)) return;
    const key = event.key.toLowerCase();
    if (['arrowright', 'arrowdown', ' ', 'pagedown'].includes(key)) { event.preventDefault(); render(current + 1, true); }
    else if (['arrowleft', 'arrowup', 'pageup'].includes(key)) { event.preventDefault(); render(current - 1, true); }
    else if (key === 'home') { event.preventDefault(); render(0, true); }
    else if (key === 'end') { event.preventDefault(); render(slides.length - 1, true); }
    else if (key === 'n') notesToggle();
    else if (key === 'o') openOverview();
    else if (key === 'f') fullscreen();
  });
  render(fromHash());
})();


