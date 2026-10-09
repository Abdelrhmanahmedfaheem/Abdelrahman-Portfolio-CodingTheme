const canvas = document.getElementById("webCanvas");
const ctx = canvas.getContext("2d");
const nav = document.querySelector(".nav");
const menuBtn = document.getElementById("menuBtn");

// Matrix Rain effect
let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'\'#&_(),.;:?!\\|{}<>[]^~';
letters = letters.split('');

let fontSize = 14;
let columns = 0;
let drops = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = canvas.width / fontSize;
  drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * canvas.height;
  }
}
resize();
window.addEventListener("resize", resize);

function drawMatrix() {
  ctx.fillStyle = "rgba(13, 17, 23, 0.05)"; // matches --bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#3fb950"; // --success color
  ctx.font = fontSize + "px 'Fira Code', monospace";
  
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Animation loop
let lastTime = 0;
function animate(time) {
  if (time - lastTime > 50) {
    drawMatrix();
    lastTime = time;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Intersection Observers for reveal animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Navigation
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});
document.querySelectorAll("#navLinks a").forEach(a => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll("#navLinks a")];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
sections.forEach(s => activeObserver.observe(s));
