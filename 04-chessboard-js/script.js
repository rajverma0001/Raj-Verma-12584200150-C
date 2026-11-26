// All HTML elements and CSS rules are applied purely via JavaScript
Object.assign(document.body.style, {
  margin: "0",
  padding: "24px",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#14211b",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: "#ecfdf5",
});

const titleEl = document.createElement("h1");
titleEl.textContent = "Interactive JavaScript Chessboard";
Object.assign(titleEl.style, {
  margin: "0 0 6px 0",
  fontSize: "1.6rem",
  letterSpacing: "0.3px",
});

const subEl = document.createElement("p");
subEl.textContent = "Every DOM node and CSS property is generated dynamically using JavaScript.";
Object.assign(subEl.style, {
  margin: "0 0 20px 0",
  color: "#a7f3d0",
  fontSize: "0.93rem",
});

const chessFrame = document.createElement("div");
Object.assign(chessFrame.style, {
  padding: "16px",
  backgroundColor: "#1f352b",
  borderRadius: "14px",
  border: "1px solid #2d4f3e",
  boxShadow: "0 22px 44px rgba(0, 0, 0, 0.5)",
});

const gridEl = document.createElement("div");
Object.assign(gridEl.style, {
  display: "grid",
  gridTemplateColumns: "repeat(8, 60px)",
  gridTemplateRows: "repeat(8, 60px)",
  border: "3px solid #3f6251",
});

const piecesMap = {
  0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  1: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  6: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
};

const fileLabels = ["a", "b", "c", "d", "e", "f", "g", "h"];

for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    const cell = document.createElement("div");
    const lightSquare = (r + c) % 2 === 0;

    Object.assign(cell.style, {
      width: "60px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundColor: lightSquare ? "#eeeed2" : "#769656",
      color: r < 2 ? "#111827" : "#ffffff",
      textShadow: r >= 2 ? "0 1px 3px rgba(0, 0, 0, 0.7)" : "none",
      fontSize: "34px",
      userSelect: "none",
      cursor: "pointer",
      transition: "transform 0.12s ease, filter 0.12s ease",
    });

    if (piecesMap[r]) {
      cell.textContent = piecesMap[r][c];
    }

    cell.title = `${fileLabels[c]}${8 - r}`;
    cell.addEventListener("mouseenter", () => {
      cell.style.filter = "brightness(1.1)";
    });
    cell.addEventListener("mouseleave", () => {
      cell.style.filter = "none";
    });

    gridEl.appendChild(cell);
  }
}

chessFrame.appendChild(gridEl);
document.body.append(titleEl, subEl, chessFrame);
