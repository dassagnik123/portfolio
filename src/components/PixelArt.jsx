// Draws a sprite from rows of palette letters ('.' = empty), one SVG rect per art pixel.
export default function PixelArt({ art, palette, pixel, className = "" }) {
  return (
    <svg
      width={art[0].length * pixel}
      height={art.length * pixel}
      viewBox={`0 0 ${art[0].length} ${art.length}`}
      shapeRendering="crispEdges"
      className={`block ${className}`}
    >
      {art.flatMap((row, y) =>
        [...row].map((c, x) =>
          palette[c] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[c]} /> : null,
        ),
      )}
    </svg>
  );
}
