import { useId } from 'react';
import { HOLE_SPACING_PX, HOLE_RADIUS_PX, BOARD_PADDING_PX } from '../../constants';

interface Props {
  cols: number;
  rows: number;
  isBack: boolean;
}

export default function BoardGrid({ cols, rows, isBack }: Props) {
  const patternId = useId();
  const w = cols * HOLE_SPACING_PX + BOARD_PADDING_PX * 2;
  const h = rows * HOLE_SPACING_PX + BOARD_PADDING_PX * 2;
  const boardColor = isBack ? '#dce8f0' : '#e8dfd4';

  return (
    <svg
      width={w}
      height={h}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <pattern
          id={patternId}
          x={BOARD_PADDING_PX}
          y={BOARD_PADDING_PX}
          width={HOLE_SPACING_PX}
          height={HOLE_SPACING_PX}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={HOLE_SPACING_PX / 2}
            cy={HOLE_SPACING_PX / 2}
            r={HOLE_RADIUS_PX}
            fill="rgba(0,0,0,0.25)"
          />
        </pattern>
      </defs>
      {/* Board background */}
      <rect width={w} height={h} fill={boardColor} rx={8} />
      {/* Hole pattern */}
      <rect
        x={BOARD_PADDING_PX}
        y={BOARD_PADDING_PX}
        width={cols * HOLE_SPACING_PX}
        height={rows * HOLE_SPACING_PX}
        fill={`url(#${patternId})`}
      />
      {/* Border */}
      <rect width={w} height={h} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2} rx={8} />
    </svg>
  );
}
