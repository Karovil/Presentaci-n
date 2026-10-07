/* ==========================================================================
   EXPIA · HUD
   Marco cartográfico (reglas que siguen a la cámara), escala de zoom, capa
   actual, reloj, medidor de profundidad y leyenda de escena.
   ========================================================================== */
EX.hud = (() => {
  const U = EX.u, Wd = EX.world, T = EX.text;
  const $ = (s) => document.querySelector(s);
  const el = {
    rulerX: $('.ruler--x'), rulerY: $('.ruler--y'),
    scale: $('[data-scale]'), coords: $('[data-coords]'), layer: $('[data-layer]'),
    code: $('[data-code]'), name: $('[data-name]'), clock: $('[data-clock]'),
    depth: $('.depth'), hint: $('[data-hint]'),
    capK: $('.caption__k'), capT: $('.caption__t'), cap: $('.caption'),
  };

  /* Reglas: marcas que se desplazan con la cámara (sensación de mapa) */
  const ticksX = [], ticksY = [];
  for (let i = 0; i < 60; i++) { const t = document.createElement('i'); el.rulerX.appendChild(t); ticksX.push(t); }
  for (let i = 0; i < 36; i++) { const t = document.createElement('i'); el.rulerY.appendChild(t); ticksY.push(t); }

  function updateRulers() {
    const z = Wd.cam.z;
    const step = 50;
    const { W, H } = Wd.size;
    const ox = (((-Wd.cam.x * z) % (step * z)) + step * z) % (step * z);
    ticksX.forEach((t, i) => {
      const x = W / 2 + ox + (i - 30) * step * z;
      t.style.transform = `translateX(${x.toFixed(1)}px)`;
      t.className = (Math.round((Wd.cam.x + (x - W / 2) / z) / step) % 5 === 0) ? 'is-major' : '';
    });
    const oy = (((-Wd.cam.y * z) % (step * z)) + step * z) % (step * z);
    ticksY.forEach((t, i) => {
      const y = H / 2 + oy + (i - 18) * step * z;
      t.style.transform = `translateY(${y.toFixed(1)}px)`;
      t.className = (Math.round((Wd.cam.y + (y - H / 2) / z) / step) % 5 === 0) ? 'is-major' : '';
    });
    el.scale.textContent = `1:${U.fmt(Math.max(1, 1000 / z))}`;
    el.coords.textContent = `${Wd.cam.x >= 0 ? '+' : '−'}${U.pad(Math.abs(Math.round(Wd.cam.x)), 4)} · ${Wd.cam.y >= 0 ? '+' : '−'}${U.pad(Math.abs(Math.round(Wd.cam.y)), 4)}`;
  }

  /* Medidor de profundidad (navegación por escenas) */
  function buildDepth(onPick) {
    el.depth.innerHTML = T.scenes.map((s, i) =>
      `<button type="button" data-i="${i}" aria-label="${s.code} ${s.name}"><i></i><em>${s.code}</em><span>${s.name}</span></button>`).join('');
    el.depth.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) onPick(+b.dataset.i);
    });
  }

  function setScene(i, step, steps) {
    const s = T.scenes[i];
    el.code.textContent = s.code;
    el.name.textContent = s.name;
    el.layer.textContent = s.layer;
    el.hint.textContent = s.hint || T.defaultHint;
    el.depth.querySelectorAll('button').forEach((b, k) => {
      b.classList.toggle('is-on', k === i);
      b.classList.toggle('is-past', k < i);
    });
    el.depth.style.setProperty('--p', ((i + (step + 1) / steps) / T.scenes.length).toFixed(3));
  }

  /* Leyenda de escena (abajo a la izquierda) */
  let capTimer = 0;
  function caption(kicker, text) {
    clearTimeout(capTimer);
    el.cap.classList.add('is-swap');
    capTimer = setTimeout(() => {
      el.capK.textContent = kicker || '';
      el.capT.textContent = text || '';
      el.cap.classList.toggle('is-empty', !text);
      el.cap.classList.remove('is-swap');
    }, el.capT.textContent ? 420 : 0);
  }

  new U.Loop(() => updateRulers()).start();
  const tick = () => { const d = new Date(); el.clock.textContent = `${U.pad(d.getHours())}:${U.pad(d.getMinutes())}:${U.pad(d.getSeconds())}`; };
  tick();
  setInterval(tick, 1000);

  return { buildDepth, setScene, caption };
})();
