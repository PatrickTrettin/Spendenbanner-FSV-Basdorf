
const grid = document.getElementById("grid-container");
let feldNummer = 1;
const belegteFelder = {
    "Feld 1": { typ: "text", inhalt: "Patrick Trettin" },
    "Feld 15": { typ: "bild", inhalt: "Bäckerei.png" },
    
};
const premiumCoords = [
    { row: 1, col: 1, className: "tile big-tile premium-top-left", label: "🌟 Premium TL", tooltip: "🌟 Premiumfeld ab 200 €..." },
    { row: 1, col: 13, className: "tile big-tile premium-top-right", label: "🌟 Premium TR", tooltip: "🌟 Premiumfeld ab 200 €..." },
    { row: 9, col: 1, className: "tile big-tile premium-bottom-left", label: "🌟 Premium BL", tooltip: "🌟 Premiumfeld ab 200 €..." },
    { row: 9, col: 13, className: "tile big-tile premium-bottom-right", label: "🌟 Premium BR", tooltip: "🌟 Premiumfeld ab 200 €..." },
    { row: 5, col: 6, className: "tile big-tile premium-center", label: "🏆 Premium Center", tooltip: "🏆 Premiumfeld Mitte ab 500 €..." }
];
const blockedKeys = [
    '1-1','1-2','2-1','2-2',
    '1-13','1-14','2-13','2-14',
    '9-1','9-2','10-1','10-2',
    '9-13','9-14','10-13','10-14',
    '5-6','5-7','5-8','6-6','6-7','6-8'
];
for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 14; col++) {
        const key = `${row}-${col}`;
        if (blockedKeys.includes(key)) continue;
        const tile = document.createElement("div");
        tile.className = "tile";
        const label = `Feld ${feldNummer++}`;
        if (belegteFelder[label]) {
            const info = belegteFelder[label];
            tile.classList.add("tile-blocked");
            if (info.typ === "bild") {
                const img = document.createElement("img");
                img.src = info.inhalt;
                img.alt = label;
                img.style.maxWidth = "100%";
                img.style.maxHeight = "100%";
                tile.appendChild(img);
            } else {
                tile.innerText = info.inhalt;
            }
        } else {
            tile.innerText = label;
            tile.title = "💙 Ab 10 €...";
            tile.addEventListener("click", () => {
                const url = `https://www.paypal.me/PatrickTrettin?note=${encodeURIComponent(label)}`;
                window.open(url, "_blank");
            });
        }
        grid.appendChild(tile);
    }
}
premiumCoords.forEach(({ row, col, className, label, tooltip }) => {
    const tile = document.createElement("div");
    tile.className = className;

    if (belegteFelder[label]) {
        const info = belegteFelder[label];
        tile.classList.add("tile-blocked");
        if (info.typ === "bild") {
            const img = document.createElement("img");
            img.src = info.inhalt;
            img.alt = label;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            tile.appendChild(img);
        } else {
            tile.innerText = info.inhalt;
        }
    } else {
        tile.innerText = label;
        tile.title = tooltip;
        tile.addEventListener("click", () => {
            let amount = label.includes("Center") ? 500 : 200;
            const url = `https://www.paypal.me/PatrickTrettin?note=${encodeURIComponent(label)}`;
            window.open(url, "_blank");
        });
    }

    grid.appendChild(tile);
});
const anzahlNormaleFelder = feldNummer - 1;
const anzahlPremiumFelder = premiumCoords.length;
const totalFelder = anzahlNormaleFelder + anzahlPremiumFelder;

const belegteAnzahl = Object.keys(belegteFelder).length;
const freieAnzahl = totalFelder - belegteAnzahl;

const counter = document.getElementById("counter");
counter.innerHTML = `💙 <strong>${freieAnzahl}</strong> von <strong>${totalFelder}</strong> Kacheln frei –  
🥳 <strong>${belegteAnzahl}</strong> schon vergeben!`;
