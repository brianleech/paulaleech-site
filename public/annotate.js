// Annotation overlay — append ?draw to any page URL to activate.
// Press D to draw, E to erase, C to clear, S to save PNG to ~/Downloads, ESC to exit.
// Saved PNG includes page background + your scribbles, viewport-sized.
(function () {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('draw')) return;

  const css = `
    .pl-anno-canvas { position: fixed; inset: 0; z-index: 999998; cursor: crosshair; touch-action: none; }
    .pl-anno-hud {
      position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
      z-index: 999999; background: #1a1a1a; color: #fff;
      font-family: system-ui, -apple-system, sans-serif; font-size: 12px;
      padding: 10px 14px; border-radius: 8px;
      display: flex; gap: 12px; align-items: center;
      box-shadow: 0 6px 24px rgba(0,0,0,0.3);
      letter-spacing: 0.02em;
    }
    .pl-anno-hud button {
      background: #333; color: #fff; border: 0; padding: 6px 10px;
      border-radius: 4px; font-size: 11px; cursor: pointer;
      font-family: inherit; letter-spacing: 0.04em; text-transform: uppercase;
    }
    .pl-anno-hud button:hover { background: #555; }
    .pl-anno-hud button.active { background: #c44; }
    .pl-anno-hud .swatch { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #555; cursor: pointer; }
    .pl-anno-hud .swatch.active { border-color: #fff; }
    .pl-anno-hud .key { opacity: 0.5; font-size: 10px; margin-left: 2px; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const canvas = document.createElement('canvas');
  canvas.className = 'pl-anno-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#e23636', '#1d8aff', '#2bb673', '#fbbf24'];
  let color = colors[0];
  let size = 4;
  let mode = 'draw'; // draw | erase
  let drawing = false;

  function down(e) {
    drawing = true;
    const p = pt(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    e.preventDefault();
  }
  function move(e) {
    if (!drawing) return;
    const p = pt(e);
    if (mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
    }
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }
  function up() { drawing = false; }
  function pt(e) {
    const t = e.touches ? e.touches[0] : e;
    const r = canvas.getBoundingClientRect();
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  canvas.addEventListener('mousedown', down);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  canvas.addEventListener('touchstart', down);
  canvas.addEventListener('touchmove', move);
  canvas.addEventListener('touchend', up);

  // HUD
  const hud = document.createElement('div');
  hud.className = 'pl-anno-hud';
  hud.innerHTML = `
    <strong>Annotate</strong>
    <button data-act="draw" class="active">Draw<span class="key">D</span></button>
    <button data-act="erase">Erase<span class="key">E</span></button>
    ${colors.map((c, i) => `<span class="swatch ${i===0?'active':''}" data-color="${c}" style="background:${c}"></span>`).join('')}
    <button data-act="clear">Clear<span class="key">C</span></button>
    <button data-act="save">Save<span class="key">S</span></button>
    <button data-act="exit">Exit<span class="key">Esc</span></button>
  `;
  document.body.appendChild(hud);

  function setActiveBtn(act) {
    hud.querySelectorAll('button[data-act="draw"], button[data-act="erase"]').forEach(b => {
      b.classList.toggle('active', b.dataset.act === act);
    });
  }
  function setActiveColor(c) {
    color = c;
    hud.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.color === c));
  }

  hud.addEventListener('click', (e) => {
    if (e.target.classList.contains('swatch')) {
      setActiveColor(e.target.dataset.color);
      mode = 'draw';
      setActiveBtn('draw');
      return;
    }
    const act = e.target.closest('button')?.dataset.act;
    if (!act) return;
    if (act === 'draw') { mode = 'draw'; setActiveBtn('draw'); }
    if (act === 'erase') { mode = 'erase'; setActiveBtn('erase'); }
    if (act === 'clear') { ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.restore(); }
    if (act === 'save') savePNG();
    if (act === 'exit') exitOverlay();
  });

  function savePNG() {
    // Just save the drawing layer (transparent background) — small file,
    // I can overlay it on a fresh screenshot of the same URL.
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-').replace(/T/, '_').slice(0, 19);
      a.href = URL.createObjectURL(blob);
      a.download = `paula-annotation-${ts}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Flash confirmation
      const orig = hud.innerHTML;
      hud.innerHTML = '<strong>Saved to ~/Downloads — tell Cinder the filename</strong>';
      setTimeout(() => { hud.innerHTML = orig; }, 1800);
    });
  }

  function exitOverlay() {
    canvas.remove();
    hud.remove();
    style.remove();
    const url = new URL(window.location);
    url.searchParams.delete('draw');
    window.history.replaceState({}, '', url);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') { mode = 'draw'; setActiveBtn('draw'); }
    if (e.key === 'e' || e.key === 'E') { mode = 'erase'; setActiveBtn('erase'); }
    if (e.key === 'c' || e.key === 'C') { ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.restore(); }
    if (e.key === 's' || e.key === 'S') savePNG();
    if (e.key === 'Escape') exitOverlay();
  });
})();
