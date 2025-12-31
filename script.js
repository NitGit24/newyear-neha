/* 🔒 HARD RESET — PREVENT CONTENT FLASH / SKIP (iOS SAFE) */
(() => {
  const lock = document.getElementById("lock-screen");
  const content = document.getElementById("main-content");
  const unlockBtn = document.getElementById("unlock-btn");
  const musicToggle = document.querySelector(".music-toggle");

  if (content) {
    content.style.display = "none";
    content.classList.add("hidden");
  }

  if (lock) {
    lock.style.display = "flex";
    lock.classList.remove("hidden");
  }

  if (unlockBtn) unlockBtn.classList.add("hidden");
  if (musicToggle) musicToggle.classList.add("hidden");

  window.scrollTo(0, 0);
})();

// 🎉 NEW YEAR COUNTDOWN (LOCAL TIME)
const now = new Date();
const newYearTime = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0).getTime();

const countdownEl = document.getElementById("countdown");
const unlockBtn = document.getElementById("unlock-btn");
const lockText = document.getElementById("lock-text");
const lockHint = document.getElementById("lock-hint");
const lockScreen = document.getElementById("lock-screen");
const mainContent = document.getElementById("main-content");
const music = document.getElementById("bg-music");
const musicToggle = document.querySelector(".music-toggle");

let isUnlocked = false;

/* COUNTDOWN */
const timer = setInterval(() => {
  const diff = newYearTime - Date.now();

  if (diff <= 0) {
    clearInterval(timer);
    countdownEl.innerText = "00:00:00";
    lockText.innerText = "It’s midnight!";
    lockHint.innerText = "Tap when you’re ready ✨";
    unlockBtn.classList.remove("hidden");
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");

  countdownEl.innerText = `${hours}:${mins}:${secs}`;
}, 1000);

/* FADE IN MUSIC */
function fadeInMusic(duration = 3000) {
  music.volume = 0;
  music.play().catch(() => {});
  const steps = 30;
  let current = 0;

  const fade = setInterval(() => {
    current++;
    music.volume = Math.min(0.6, (current / steps) * 0.6);
    if (current >= steps) clearInterval(fade);
  }, duration / steps);
}

/* UNLOCK FLOW */
function unlockMoment() {
  if (isUnlocked) return;
  isUnlocked = true;

  lockScreen.style.display = "none";
  lockScreen.classList.add("hidden");

  mainContent.style.display = "flex";
  mainContent.classList.remove("hidden");
  mainContent.classList.add("unlocked"); // triggers fade-in
  document.body.classList.remove("locked"); // allow scrolling

  setTimeout(() => {
    mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);

  const sparkles = document.getElementById("sparkles");
  if (sparkles) {
    sparkles.style.opacity = 1;
    sparkles.style.animation = "sparkle 2s ease-out";
  }

  // 🎆 start fireworks
  fireworksActive = true;
  animateFireworks();

  fadeInMusic();
  musicToggle.classList.remove("hidden");

  // optional subtle parallax
  window.addEventListener("deviceorientation", e => {
    const x = e.gamma || 0;
    const y = e.beta || 0;
    document.body.style.transform = `translate(${x/12}px, ${y/12}px)`;
  }, true);
}

/* MUSIC TOGGLE */
function toggleMusic() {
  if (music.paused) {
    music.play();
    musicToggle.classList.add("playing");
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
  }
}

/* MODALS */
function showMessage(type) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  if (type === "smile") {
    body.innerHTML = `
      <p>
        If you smiled even a lil,<br>
        that’s more than enough for me 🙂‍↔️<br><br>
        Mission accomplished.
      </p>`;
  }

  if (type === "gallery") {
    body.innerHTML = `
      <div class="memory-wrapper">
        <div class="gallery">
          <img src="images/photo2.jpeg">
          <img src="images/photo5.jpeg">
          <img src="images/photo3.jpeg">
          <img src="images/photo4.jpeg">
        </div>
        <div class="swipe-hint">← swipe →</div>
        <div class="memory-caption">
          Just some moments I like looking back on 🤍
        </div>
      </div>`;
  }

  if (type === "note") {
    body.innerHTML = `
      <p>
        I don’t usually do things like this,<br><br>
        but some people quietly become important,
        and i had to say this to you.<br><br>
        I love the way you exist, how you're so kind,
        thoughtful and unfairly soo damn cute 😭<br><br>
        I just wanted you to know you matter to me.<br><br>
        And I hope you receive soo much love and kindness this year, 
        the kind you've always given so freely.<br><br> 
        Happy New Year 🤍🫂
      </p>`;
  }

  if (type === "wish") {
    body.innerHTML = `
      <p>
        That this year is gentle with you,<br>
        and reminds you how special you are💃
      </p>`;
  }

  if (type === "video") {
    body.innerHTML = `
      <div class="video-wrapper">
        <video controls playsinline>
          <source src="video/memory.mp4" type="video/mp4">
        </video>
        <p class="video-caption">
          This one makes me smile every time 😭
        </p>
      </div>`;

    const video = body.querySelector("video");
    video.volume = 1.0;

    video.addEventListener("play", () => {
      if (music.paused) music.play().catch(() => {});
    });
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal-body").innerHTML = "";
  music.play().catch(() => {});
}

/* 🎆 FIREWORKS BACKGROUND (3D FEEL) */
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

let cw, ch;
let fireworksActive = false;
let particles = [];

function resizeCanvas() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.speed = Math.random() * 5 + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.friction = 0.98;
    this.gravity = 0.04;
    this.hue = hue;
    this.alpha = 1;
    this.depth = Math.random() * 0.6 + 0.4; // pseudo 3D
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed * this.depth;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= 0.015;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * this.depth, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue},100%,70%,${this.alpha})`;
    ctx.fill();
  }
}

function createFirework() {
  const x = Math.random() * cw;
  const y = Math.random() * ch * 0.5;
  const hue = Math.random() * 360;

  for (let i = 0; i < 40; i++) {
    particles.push(new Particle(x, y, hue));
  }
}

function animateFireworks() {
  if (!fireworksActive) return;

  ctx.clearRect(0, 0, cw, ch);

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  if (Math.random() < 0.04) createFirework();

  requestAnimationFrame(animateFireworks);
}

/* ================================
   ✨ Personal Hidden Layer (Long Press Tooltip)
   ================================ */

const mainTitle = document.querySelector(".title");

if (mainTitle) {
  let pressTimer;
  let tooltip;

  const showTooltip = () => {
    tooltip = document.createElement("div");
    tooltip.className = "long-press-tooltip";
    tooltip.innerText = "I meant every bit of this 💛";
    document.body.appendChild(tooltip);

    const rect = mainTitle.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.opacity = 0;
    tooltip.style.transform = "translate(-50%, -10px) scale(0.8)";
    
    requestAnimationFrame(() => {
      tooltip.style.opacity = 1;
      tooltip.style.transform = "translate(-50%, -30px) scale(1)";
    });

    setTimeout(() => {
      if (tooltip) {
        tooltip.style.opacity = 0;
        tooltip.style.transform = "translate(-50%, -10px) scale(0.8)";
        setTimeout(() => tooltip.remove(), 400);
      }
    }, 3000);
  };

  const startPress = () => {
    pressTimer = setTimeout(showTooltip, 800);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  mainTitle.addEventListener("mousedown", startPress);
  mainTitle.addEventListener("touchstart", startPress);
  mainTitle.addEventListener("mouseup", cancelPress);
  mainTitle.addEventListener("mouseleave", cancelPress);
  mainTitle.addEventListener("touchend", cancelPress);
  mainTitle.addEventListener("touchcancel", cancelPress);
}
