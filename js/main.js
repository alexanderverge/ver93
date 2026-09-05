(function () {
  "use strict";

  var canvas = document.getElementById("bg-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  var blobs = [
    { x: 0.15, y: 0.12, r: 460, sat: 0.4, l: 0.72, sp: 0.00011, ph: 0 },
    { x: 0.85, y: 0.3, r: 380, sat: 0.35, l: 0.7, sp: 0.00014, ph: 2.1 },
    { x: 0.5, y: 0.85, r: 520, sat: 0.3, l: 0.75, sp: 0.00009, ph: 4.2 },
    { x: 0.1, y: 0.65, r: 320, sat: 0.38, l: 0.7, sp: 0.00016, ph: 1.0 },
  ];

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#eef2f6";
    ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];
      var dx = Math.sin(t * b.sp + b.ph) * 0.12;
      var dy = Math.cos(t * b.sp * 0.8 + b.ph) * 0.12;
      var cx = (b.x + dx) * w;
      var cy = (b.y + dy) * h;
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
      grad.addColorStop(0, "hsla(214, " + b.sat * 100 + "%, " + b.l * 100 + "%, 0.35)");
      grad.addColorStop(1, "hsla(214, " + b.sat * 100 + "%, " + b.l * 100 + "%, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    draw(0);
    return;
  }

  var raf;
  function tick(t) {
    draw(t);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  window.addEventListener("pagehide", function () {
    cancelAnimationFrame(raf);
  });
})();
