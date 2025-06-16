// Verbesserte Version von script.js für zuverlässige Anzeige

const grid = document.getElementById("grid-container");
const counter = document.getElementById("counter");
let feldNummer = 1;

const belegteFelder = {
  "Feld 1": { typ: "text", inhalt: "Patrick Trettin" },
  "Feld 15": { typ: "bild", inhalt: "Bäckerei.png" },
};

const premiumFelder = [
  { label: "🌟 Premium TL", wert: 200 },
  { label: "🌟 Premium TR", wert: 200 },
  { label: "🌟 Premium BL", wert: 200 },
  { label: "🌟 Premium BR", wert: 200 },
  { label: "🏆 Premium Center", wert: 500 },
];

const premiumCoords = [
  { row: 1, col: 1, className: "tile big-tile premium-top-left", label: "🌟 Premium TL" },
  { row: 1, col: 13, className: "tile big-tile premium-top-right", label: "🌟 Premium TR" },
  { row: 9, col: 1, className: "tile big-tile premium-bottom-left", label: "🌟 Premium BL" },
  { row: 9, col: 13, className: "tile big-tile premium-bottom-right", label: "🌟 Premium BR" },
  { row: 5, col: 6, className: "tile big-tile premium-center", label: "🏆 Premium Center" },
];

const blockedKeys = [
  "1-1","1-2","2-1","2-2",
  "1-13","1-14","2-13","2-14",
  "9-1","9-2","10-1","10-2",
  "9-13","9-14","10-13","10-14",
  "5-6","5-7","5-8","6-6","6-7","6-8"
];

const isMobile = window.innerWidth < 1024;

function createTile(label, extraClass = "", isPremium = false) {
  const tile = document.createElement("div");
  tile.className = `tile ${extraClass}`.trim();

  if (belegteFelder[label]) {
    const info = belegteFelder[label];
    tile.classList.add("tile-blocked");
    if (info.typ === "bild") {
      const img = document.createElement("img");
      img.src = info.inhalt;
      img.alt = label;
      tile.appendChild(img);
    } else {
      tile.textContent = info.inhalt;
    }
  } else {
    tile.textContent = label;
    tile.title = isPremium ? `🌟 Premiumfeld ab ${label.includes("Center") ? 500 : 200} €...` : "💙 Ab 10 €...";
    tile.addEventListener("click", () => {
      const url = `https://www.paypal.me/PatrickTrettin?note=${encodeURIComponent(label)}`;
      window.open(url, "_blank");
    });
  }
  return tile;
}

if (isMobile) {
  // Mobile: Premium zuerst, dann normale Felder
  premiumFelder.forEach(({ label }) => {
    const tile = createTile(label, "big-tile", true);
    grid.appendChild(tile);
  });

  for (let i = 0; i < 98; i++) {
    const label = `Feld ${feldNummer++}`;
    const tile = createTile(label);
    grid.appendChild(tile);
  }

} else {
  // Desktop: Normale Felder mit Lücken für Premium
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 14; col++) {
      const key = `${row}-${col}`;
      if (blockedKeys.includes(key)) continue;
      const label = `Feld ${feldNummer++}`;
      const tile = createTile(label);
      grid.appendChild(tile);
    }
  }

  // Feste Premium-Felder an definierten Positionen
  premiumCoords.forEach(({ className, label }) => {
    const tile = createTile(label, className, true);
    grid.appendChild(tile);
  });
}

const totalFelder = feldNummer - 1 + premiumFelder.length;
const belegteAnzahl = Object.keys(belegteFelder).length;
const freieAnzahl = totalFelder - belegteAnzahl;

counter.innerHTML = `💙 <strong>${freieAnzahl}</strong> von <strong>${totalFelder}</strong> Kacheln frei – 🥳 <strong>${belegteAnzahl}</strong> schon vergeben!`;
