/* ------------------------------
  Fancy Fishing Scene (cartoony, smooth)
  - Giữ gò đất ở góc trái
  - Người ngồi trên ghế, có mũ tam giác
  - Đầu theo chuột (nhẹ nhàng)
  - Cần câu + dây theo chuột khi không hover form
  - Cá hoạt hình, đuôi vẫy, mắt sáng
  - Bắt -> lê về cần -> thả -> trượt ra cạnh -> tái sinh mượt
  - Bubbles, ánh sáng, bóng đổ để tăng chiều sâu
  - Dài, chú thích đầy đủ để dễ tuỳ chỉnh
-------------------------------*/

const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

// --- resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// --- input (mouse) tracking
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isPointerDown = false;
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
canvas.addEventListener("mousedown", () => (isPointerDown = true));
canvas.addEventListener("mouseup", () => (isPointerDown = false));

// --- detect hover on auth form (do not cast when hovering)
let isHoverForm = false;
const authContainer = document.querySelector(".auth-container");
if (authContainer) {
  authContainer.addEventListener("mouseenter", () => (isHoverForm = true));
  authContainer.addEventListener("mouseleave", () => (isHoverForm = false));
}

// --- utility easing functions
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// --- create decorative background gradient + subtle vignette
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#021028");
  g.addColorStop(0.5, "#021c36");
  g.addColorStop(1, "#00122a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // subtle vignette
  const vignette = ctx.createRadialGradient(
    canvas.width * 0.25, canvas.height * 0.2, canvas.width * 0.1,
    canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.9
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// --- small floating light particles to add ambience
const particles = [];
for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.6 + 0.2,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.2) * 0.2
  });
}
function updateParticles() {
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.y > canvas.height + 10) p.y = -10;
  });
}
function drawParticles() {
  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(200,255,255,${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- bubbles (underwater feel)
const bubbles = [];
for (let i = 0; i < 60; i++) {
  bubbles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.8,
    dy: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.6 + 0.2
  });
}
function updateBubbles() {
  bubbles.forEach(b => {
    b.y -= b.dy;
    b.x += Math.sin((b.y + b.r) * 0.01) * 0.2;
    if (b.y < -10) {
      b.y = canvas.height + Math.random() * 80;
      b.x = Math.random() * canvas.width;
    }
  });
}
function drawBubbles() {
  ctx.save();
  bubbles.forEach(b => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${b.alpha * 0.4})`;
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// --- Fish class (cartoonish)
class Fish {
  constructor(x, y, size, speed, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.direction = Math.random() < 0.5 ? 1 : -1; // 1 = phải, -1 = trái
    this.angle = Math.random() * Math.PI * 2;
    this.tailAngle = 0;
    this.isCaught = false;
    this.catchProgress = 0;
    this.respawning = false; // ✅ trạng thái tái tạo ở ngoài màn hình
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.direction, 1);

    const rotate = Math.sin(this.angle * 0.8) * 0.2;
    ctx.rotate(rotate);

    // 🟡 Thân cá
    const gradient = ctx.createLinearGradient(-this.size * 1.5, 0, this.size * 1.5, 0);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.color + "55");
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 1.5, this.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();

    // 🌀 Đuôi cá
    this.tailAngle += 0.25;
    const tailWag = Math.sin(this.tailAngle) * this.size * 0.5;
    ctx.beginPath();
    ctx.moveTo(-this.size * 1.5, 0);
    ctx.lineTo(-this.size * 2, tailWag);
    ctx.lineTo(-this.size * 2, -tailWag);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    // 👁 Mắt cá
    ctx.beginPath();
    ctx.arc(this.size * 1.1, -this.size / 3, this.size / 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.size * 1.1 + this.size / 12, -this.size / 3, this.size / 12, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.restore();
  }

  update() {
    if (!this.isCaught) {
      // 🧭 Di chuyển
      this.x += this.speed * this.direction;
      this.angle += 0.04;
      this.y += Math.sin(this.angle) * 0.5;

      // 🧠 Nếu bơi ra khỏi màn hình → chuẩn bị tái tạo ở ngoài canvas (respawn)
      if (!this.respawning) {
        if (this.direction === 1 && this.x > canvas.width + 100) {
          this.respawn(-100);
        } else if (this.direction === -1 && this.x < -100) {
          this.respawn(canvas.width + 100);
        }
      }
    } else {
      // 🪝 Khi bị bắt
      this.catchProgress += 0.05;
      const targetX = fisherman.x + 40;
      const targetY = fisherman.y - 120;
      this.x += (targetX - this.x) * 0.1;
      this.y += (targetY - this.y) * 0.1;

      if (this.catchProgress >= 1) {
        this.isCaught = false;
        this.catchProgress = 0;
        this.respawn(); // 🎯 tái tạo ngoài canvas khi thả ra
      }
    }
  }

  respawn(forcedX) {
    // 🧠 Hàm tái tạo cá ngoài màn hình
    this.respawning = true;
    this.direction = Math.random() < 0.5 ? 1 : -1;
    this.y = Math.random() * canvas.height;
    this.x = forcedX !== undefined 
      ? forcedX 
      : (this.direction === 1 ? -100 : canvas.width + 100);
    this.angle = Math.random() * Math.PI * 2;

    // 🕒 Đợi 0.5s rồi cho cá hoạt động trở lại
    setTimeout(() => {
      this.respawning = false;
    }, 500);
  }
}


// helper: darken/lighten color hex
function shadeColor(hex, percent) {
  // accepts "#rrggbb" or "rgb(...)"? We'll keep simple for hex input
  if (hex[0] === "#") {
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = clamp(Math.round(r), 0, 255);
    g = clamp(Math.round(g), 0, 255);
    b = clamp(Math.round(b), 0, 255);
    return `rgb(${r},${g},${b})`;
  }
  return hex;
}

// --- Fisherman (cartoony, sitting on small mound/gò đất)
class Fisherman {
  constructor() {
    // fixed location near bottom-left — keep original vibe
    this.baseX = 120; // shift right a bit so rod extends
    this.baseY = canvas.height - 40;
    this.x = this.baseX;
    this.y = this.baseY;
    this.wob = 0;
    this.castAngle = 0;
  }

  getReelX() {
    // position where fish will be reeled to (near rod tip)
    return this.x + 120;
  }
  getReelY() {
    return this.y - 170;
  }

  drawGround() {
    // gò đất (retain and beautify)
    ctx.save();
    const gx = this.x;
    const gy = this.y + 10;
    ctx.beginPath();
    ctx.moveTo(gx - 140, gy + 20);
    ctx.quadraticCurveTo(gx - 40, gy - 120, gx + 160, gy + 20);
    ctx.lineTo(gx + 240, canvas.height + 100);
    ctx.lineTo(gx - 240, canvas.height + 100);
    ctx.closePath();
    // layered earth colors
    const grd = ctx.createLinearGradient(gx - 140, gy - 80, gx + 160, gy + 20);
    grd.addColorStop(0, "#5C4033");
    grd.addColorStop(1, "#4a2c2a");
    ctx.fillStyle = grd;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.fill();

    // small grass tufts
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0f8a3a";
    for (let i = -110; i < 150; i += 24) {
  const gx2 = gx + i + Math.sin(i * 0.5 + Date.now() * 0.001) * 1.5;
  const gy2 = gy - 6 - Math.sin(i) * 2; // giữ vị trí tương đối cố định
      ctx.beginPath();
      ctx.moveTo(gx2, gy2);
      ctx.quadraticCurveTo(gx2 + 8, gy2 - 18, gx2 + 16, gy2);
      ctx.quadraticCurveTo(gx2 + 8, gy2 - 6, gx2, gy2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawChairAndBody() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // chair
    ctx.fillStyle = "#6b3f2b";
    ctx.fillRect(-22, -42, 44, 8); // seat
    ctx.fillRect(-18, -40, 6, 36); // left leg
    ctx.fillRect(12, -40, 6, 36); // right leg
    ctx.fillRect(-22, -64, 8, 24); // left back
    ctx.fillRect(14, -64, 8, 24); // right back
    ctx.fillRect(-14, -72, 28, 8); // back top

    // body (torso)
    ctx.fillStyle = "#8b5a2b";
    ctx.beginPath();
    ctx.ellipse(0, -70, 20, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // arm left (holding rod) - positioned outwards to support rod
    ctx.save();
    ctx.translate(-6, -72);
    ctx.rotate(-0.15);
    ctx.fillStyle = "#d6a97f";
    ctx.fillRect(-4, -2, 8, 22); // upper
    // hand
    ctx.beginPath();
    ctx.arc(4, 20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // arm right (resting)
    ctx.save();
    ctx.translate(10, -72);
    ctx.rotate(0.06);
    ctx.fillStyle = "#d6a97f";
    ctx.fillRect(-3, -2, 7, 20);
    ctx.beginPath();
    ctx.arc(7, 18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // legs (sitting)
    ctx.save();
    ctx.translate(0, -48);
    ctx.fillStyle = "#4b2f1f";
    ctx.fillRect(-12, 0, 12, 30);
    ctx.fillRect(0, 0, 12, 30);
    ctx.restore();

    // head (follows mouse a little)
    const headX = 0;
    const headY = -98;
    const dx = mouseX - (this.x + headX);
    const dy = mouseY - (this.y + headY);
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(angle * 0.28); // gentle rotation proportion
    // face circle
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#f0cdab";
    ctx.fill();
    // blush
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,120,120,0.08)";
    ctx.arc(-6, 2, 5, 0, Math.PI * 2);
    ctx.fill();
    // eyes
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(-5, -2, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -2, 2.2, 0, Math.PI * 2);
    ctx.fill();
    // smile
    ctx.beginPath();
    ctx.strokeStyle = "#6b3f2b";
    ctx.lineWidth = 1.2;
    ctx.arc(0, 4, 6, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // hat (triangular) - stylized and cute
    ctx.save();
    ctx.translate(headX, headY - 18);
    ctx.rotate(angle * 0.18);
    ctx.beginPath();
    ctx.moveTo(-18, 6);
    ctx.lineTo(18, 6);
    ctx.lineTo(0, -22);
    ctx.closePath();
    ctx.fillStyle = "#5d3a22";
    ctx.fill();
    // hat rim
    ctx.beginPath();
    ctx.fillStyle = "#7b4f2e";
    ctx.fillRect(-20, 6, 40, 5);
    ctx.restore();

    ctx.restore();
  }

  drawRodAndLine() {
    ctx.save();
    ctx.translate(this.x, this.y - 80); // rod origin a bit above torso
    // rod - a long slightly curved rod
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // rod curve influenced by mouse if not hovering form
    const tipX = 100;
    const tipY = -50;
    ctx.quadraticCurveTo(60, -50, tipX, tipY);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#cfcfcf";
    ctx.stroke();

    // rod highlight
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.quadraticCurveTo(60, -49, tipX, tipY - 1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.stroke();

    // line / string that follows mouse (if not hovering form)
    if (!isHoverForm) {
      const worldTipX = this.x + tipX;
      const worldTipY = this.y - 80 + tipY;
      // we want a soft curved line to the mouse with a bit of slack
      const controlX = lerp(worldTipX - 20, mouseX, 0.22);
      const controlY = lerp(worldTipY + 60, mouseY - 30, 0.18);
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      // local coordinates -> but quadratic requires relative control; we convert to local by subtracting origin
      const localControlX = controlX - this.x;
      const localControlY = controlY - (this.y - 80);
      const localMouseX = mouseX - this.x;
      const localMouseY = mouseY - (this.y - 80);
      ctx.quadraticCurveTo(localControlX, localControlY, localMouseX, localMouseY);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(255,255,255,0.92)";
      ctx.stroke();

      // small bobber at mouse pos to indicate catch area
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,80,80,0.95)";
      // draw bobber as small circle in world coords
      const bobX = localMouseX;
      const bobY = localMouseY;
      ctx.arc(bobX, bobY, 6, 0, Math.PI * 2);
      ctx.fill();

      // detect fish collision near the bobber (simulate hook)
      fishes.forEach(f => {
        if (!f.isCaught && !f.releasing) {
          const dx = f.x - mouseX;
          const dy = f.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < f.size * 2 + 6) {
            // nice catch: mark caught -> the fish will be reeled
            f.isCaught = true;
            f.catchProgress = 0;
            // add a small satisfying wobble
            // (we could add a small particle burst here)
          }
        }
      });

    } else {
      // if hovering form, retract the line toward tip
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(50, -25);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.stroke();
    }

    ctx.restore();
  }

  update() {
    // gentle bob of the fisherman to feel alive
    this.wob += 0.01;
    this.x = lerp(this.x, this.baseX + Math.sin(this.wob) * 0.6, 0.05);
    this.y = lerp(this.y, canvas.height - 40 + Math.cos(this.wob * 0.4) * 0.6, 0.05);
  }

  draw() {
    // draw ground first then character parts on top for layering
    this.drawGround();
    this.update();
    this.drawChairAndBody();
    this.drawRodAndLine();

    // subtle shadow under chair
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 12, 60, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();
  }
}

// --- create fish population
const fishes = [];
const colorPal = ["#00e1ff", "#00baff", "#00f9ff", "#00ffcc", "#ffcf6b", "#ffa6d6"];
for (let i = 0; i < 12; i++) {
  const size = Math.random() * 10 + 10;
  const speed = Math.random() * 1.2 + 0.4;
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.15;
  const color = colorPal[Math.floor(Math.random() * colorPal.length)];
  fishes.push(new Fish(x, y, size, speed, color));
}

// --- subtle ripple effect when fish is caught/resurfaced (not necessary but nice)
const ripples = [];
function spawnRipple(x, y) {
  ripples.push({ x, y, t: 0, r: 2 });
}
function updateRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.t += 1;
    r.r += 1.5;
    if (r.t > 60) ripples.splice(i, 1);
  }
}
function drawRipples() {
  ctx.save();
  ripples.forEach(r => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(200,255,255, ${1 - r.t / 80})`;
    ctx.lineWidth = 1;
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

// --- instantiate fisherman
const fisherman = new Fisherman();

// --- animation loop
let lastTime = 0;
function animate(t) {
  const dt = t - lastTime;
  lastTime = t;

  // clear and draw background
  drawBackground();

  // ambient particles and bubbles
  updateParticles();
  drawParticles();
  updateBubbles();
  drawBubbles();

  // ripples
  updateRipples();

  // soft lights over the water area to focus center
  const lightGrad = ctx.createRadialGradient(canvas.width * 0.6, canvas.height * 0.3, 10, canvas.width * 0.6, canvas.height * 0.3, canvas.width * 0.8);
  lightGrad.addColorStop(0, "rgba(0,255,240,0.03)");
  lightGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // update & draw fishes (draw under fisherman line so fish appear behind rod sometimes)
  for (const f of fishes) {
    f.update();
    f.draw();
  }

  // draw ripples behind fisher after fish (visual)
  drawRipples();

  // draw fisherman (ground, body, rod and line)
  fisherman.draw();

  // overlay glow on caught fish to emphasize
  for (const f of fishes) {
    if (f.isCaught && f.catchProgress > 0.15) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.02 + f.catchProgress * 0.2})`;
      ctx.fill();
    }
  }

  // occasionally spawn ripple where fish released
  for (let f of fishes) {
    if (f.releasing && Math.random() < 0.004) {
      spawnRipple(f.x, f.y);
    }
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Optional: periodically add new fish if population low (keeps scene lively)
setInterval(() => {
  if (fishes.length < 12) {
    const size = Math.random() * 10 + 10;
    const speed = Math.random() * 1.2 + 0.4;
    fishes.push(new Fish(Math.random() * canvas.width, Math.random() * canvas.height * 0.6 + canvas.height * 0.15, size, speed, colorPal[Math.floor(Math.random() * colorPal.length)]));
  }
}, 5000);


