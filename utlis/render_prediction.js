import { throttle } from "lodash";

export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  const sortedPredictions = predictions
    .filter((p) => p.score >= 0.5)
    .sort((a, b) => (a.class === "person" ? 1 : -1));

  sortedPredictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const isPerson = prediction.class === "person";
    const color = isPerson ? "#FF0000" : "#00FFFF";

    // Outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Transparent fill
    ctx.fillStyle = isPerson ? "rgba(255,0,0,0.15)" : "rgba(0,255,255,0.15)";
    ctx.fillRect(x, y, width, height);

    // Label
    const label = `${prediction.class} ${(prediction.score * 100).toFixed(1)}%`;
    const textWidth = ctx.measureText(label).width;
    const textHeight = parseInt(font, 10);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, textWidth + 6, textHeight + 4);

    ctx.fillStyle = "#000000";
    ctx.fillText(label, x + 2, y + 2);

    if (isPerson) {
      playAudio();
    }
  });
};

const playAudio = throttle(() => {
  const audio = new Audio("/siren.mp3"); // correct path
  audio.play().catch((err) => console.log("Audio error:", err));
}, 2000);
