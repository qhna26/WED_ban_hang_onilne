const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();


class Fish {
  constructor(x, y, size, speed, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = Math.random() * Math.PI * 2;
    this.color = color;
    this.direction = Math.random() < 0.5 ? 1 : -1;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.sin(this.angle) * 0.3 * this.direction);


    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 1.5, this.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-this.size * 1.5 * this.direction, 0);
    ctx.lineTo(-this.size * 2 * this.direction, this.size / 2);
    ctx.lineTo(-this.size * 2 * this.direction, -this.size / 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.size * 1.1 * this.direction, -this.size / 3, this.size / 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.restore();
  }

  update() {
    this.angle += 0.02;
    this.x += this.speed * this.direction;
    this.y += Math.sin(this.angle) * 1.5;


    if (this.x > canvas.width + 50 && this.direction === 1) {
      this.x = -50;
      this.y = Math.random() * canvas.height;
    } else if (this.x < -50 && this.direction === -1) {
      this.x = canvas.width + 50;
      this.y = Math.random() * canvas.height;
    }
  }
}

const fishes = [];
const colors = ["#00e1ff", "#00baff", "#00f9ff", "#00ffcc"];
for (let i = 0; i < 10; i++) {
  const size = Math.random() * 10 + 8;
  const speed = Math.random() * 1 + 0.5;
  fishes.push(
    new Fish(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      size,
      speed,
      colors[Math.floor(Math.random() * colors.length)]
    )
  );
}

const bubbles = [];
for (let i = 0; i < 40; i++) {
  bubbles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dy: Math.random() * 0.3 + 0.1
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 1.5);
  grad.addColorStop(0, "rgba(0, 255, 255, 0.05)");
  grad.addColorStop(1, "rgba(0, 0, 50, 0.05)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  for (let b of bubbles) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    b.y -= b.dy;
    if (b.y < -5) {
      b.y = canvas.height + 5;
      b.x = Math.random() * canvas.width;
    }
  }

  for (let f of fishes) {
    f.update();
    f.draw();
  }

  requestAnimationFrame(animate);
}

animate();
