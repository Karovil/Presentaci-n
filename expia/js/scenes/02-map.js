/* ==========================================================================
   ESCENA 02 — EL MAPA DE LA ORGANIZACIÓN
   Los activos brotan del núcleo y se ordenan en regiones. La cámara entra
   lentamente. Al pasar el cursor, cada activo muestra su lectura y su región
   se resalta.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, OM = EX.orgMap, T = EX.text.map;
  const S = { steps: 1 };
  EX.scenes.map = S;

  const PREFIX = { devices: 'EQ', users: 'USR', servers: 'SRV', apps: 'APP', cloud: 'CLD', db: 'DB', networks: 'NET' };
  const ZONES = ['Zona interna', 'DMZ', 'Sucursales', 'Nube privada', 'Centro de datos'];
  let el, countEl, active = false;
  const tl = new U.Timeline();

  S.init = (section) => {
    el = section;
    el.querySelector('.surface__k').textContent = T.kicker;
    el.querySelector('.surface__u').textContent = T.countLabel;
    el.querySelector('.surface__line').textContent = T.line;
    countEl = el.querySelector('.surface__n');

    Wd.onHover((n) => {
      if (!active) return;
      if (!n || !n.info) { EX.probe.hide(); OM.focus(null); return; }
      const c = n.info.cluster;
      const deps = Wd.edges.filter((e) => e.a === n || e.b === n).length;
      OM.focus(c.key);
      EX.probe.show(`
        <span class="probe__k">${c.label}</span>
        <strong>${PREFIX[c.key]}-${U.pad(n.info.idx * 7 + 101, 4)}</strong>
        <span class="probe__row"><em>Ubicación</em>${ZONES[n.info.idx % ZONES.length]}</span>
        <span class="probe__row"><em>Dependencias</em>${deps}</span>`);
    });
  };

  const fitZ = () => Math.min(innerWidth / 2700, innerHeight / 1500);

  S.enter = () => {
    active = true;
    const fromBoot = !document.body.dataset.visited;
    document.body.dataset.visited = '1';
    EX.hud.caption('', '');
    OM.reveal(fromBoot ? { from: { x: 0, y: 0 }, stagger: 1600 } : {});
    OM.setTerrain(1);
    OM.focus(null);
    const z = fitZ();
    if (fromBoot) {
      // Entramos desde el núcleo: la organización se despliega alrededor
      Wd.setCam({ x: 0, y: 0, z: z * 1.7 });
      Wd.flyTo({ x: -150, y: 20, z: z * 0.92 }, 3200, U.ease.out);
    } else {
      Wd.flyTo({ x: -150, y: 20, z: z * 0.92 }, 2000);
    }
    tl.at(fromBoot ? 3300 : 2100, () => Wd.drift({ z: 0.028, x: -4 }));   // entrar lentamente
    tl.at(1800, () => OM.setLabels(1));
    countEl.dataset.v = 0;
    countEl.textContent = '0';
    tl.at(1400, () => U.countTo(countEl, T.count, { duration: 2600 }));
  };

  S.leave = () => {
    active = false;
    tl.clear();
    Wd.drift(null);
    EX.probe.hide();
    OM.focus(null);
  };
})();
