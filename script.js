const sheetURL = "https://script.google.com/macros/s/AKfycby8dDhVqURxFXn3NO1CQLVo3G3c0x705eJ5PptrGJ_EFjGNQr03CqPPWt8NleR97KH98w/exec";
const grid = document.getElementById("grid-container");
const counter = document.getElementById("counter");

let feldNummer = 1;

const premiumCoords = [
  { label: "🌟 Premium TL", row: 1, col: 1, rowSpan: 2, colSpan: 2 },
  { label: "🌟 Premium TR", row: 1, col: 13, rowSpan: 2, colSpan: 2 },
  { label: "🌟 Premium BL", row: 9, col: 1, rowSpan: 2, colSpan: 2 },
  { label: "🌟 Premium BR", row: 9, col: 13, rowSpan: 2, colSpan: 2 },
  { label: "🏆 Premium Center", row: 5, col: 6, rowSpan: 2, colSpan: 3 },
  { label: "⭐ Mini 1", row: 5, col: 1, rowSpan: 2, colSpan: 1 },
  { label: "⭐ Mini 2", row: 1, col: 7, rowSpan: 1, colSpan: 2 },
  { label: "⭐ Mini 3", row: 5, col: 14, rowSpan: 2, colSpan: 1 },
  { label: "⭐ Mini 4", row: 10, col: 7, rowSpan: 1, colSpan: 2 }
];

const blockedKeys = new Set();
premiumCoords.forEach(({ row, col, rowSpan, colSpan }) => {
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      blockedKeys.add(`${r}-${c}`);
    }
  }
});

async function ladeDatenUndErstelleGrid() {
  try {
    const res = await fetch(sheetURL);
    const daten = await res.json();

    const belegteFelder = {};
    daten.forEach(e => {
      if (e.Status.toLowerCase() === "belegt") {
        belegteFelder[e.Feld] = {
          typ: e.Typ.toLowerCase(),
          inhalt: e.Inhalt,
          kategorie: e.Kategorie.toLowerCase()
        };
      }
    });

    // Normale Felder
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 14; col++) {
        if (!blockedKeys.has(`${row}-${col}`)) {
          const label = `Feld ${feldNummer++}`;
          grid.appendChild(createTile(label, {}, false, belegteFelder));
        }
      }
    }

    // Premium-Felder
    premiumCoords.forEach(({ label, row, col, rowSpan, colSpan }) => {
      const style = {
        gridRow: `${row} / span ${rowSpan}`,
        gridColumn: `${col} / span ${colSpan}`,
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
      };
      grid.appendChild(createTile(label, style, true, belegteFelder));
    });

    // Zähler
    const totalFelder = feldNummer - 1 + premiumCoords.length;
    const belegteAnzahl = Object.keys(belegteFelder).length;
    const freieAnzahl = totalFelder - belegteAnzahl;
    counter.innerHTML = `💙 <strong>${freieAnzahl}</strong> von <strong>${totalFelder}</strong> Kacheln frei – 🥳 <strong>${belegteAnzahl}</strong> schon vergeben!`;

  } catch (err) {
    console.error("Fehler beim Laden der Daten:", err);
  }
}

function createTile(label, style = {}, isPremium = false, belegteFelder = {}) {
  const tile = document.createElement("div");
  tile.className = "tile";
  Object.assign(tile.style, style);

  if (belegteFelder[label]) {
    tile.classList.add("tile-blocked");

    const inhalt = belegteFelder[label];

    // Farbklasse je nach Kategorie
    if (inhalt.kategorie) {
      const klasse = inhalt.kategorie.replace(/\s/g, "-");
      tile.classList.add(klasse);
    }

    if (inhalt.typ === "logo" || inhalt.typ === "bild") {
      const img = document.createElement("img");
      img.src = inhalt.inhalt;
      img.alt = label;
      tile.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.textContent = inhalt.inhalt;
      span.classList.add("spender-name");
      tile.appendChild(span);
    }
  } else {
    tile.textContent = label;
    if (isPremium) tile.style.backgroundColor = "gold";
    tile.title = isPremium ? "🌟 Premium-Feld" : "💙 Ab 10 €...";
    tile.addEventListener("click", () => {
      const url = `https://www.paypal.me/PatrickTrettin?note=${encodeURIComponent(label)}`;
      window.open(url, "_blank");
    });
  }

  return tile;
}

// Start
ladeDatenUndErstelleGrid();
