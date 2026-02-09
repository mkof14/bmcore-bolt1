type ScoreSet = {
  evidence: number;
  context: number;
  risk: number;
  action: number;
  clarity: number;
};

const AXES: Array<keyof ScoreSet> = ['evidence', 'context', 'risk', 'action', 'clarity'];

const labelMap: Record<keyof ScoreSet, string> = {
  evidence: 'Evidence',
  context: 'Context',
  risk: 'Risk',
  action: 'Action',
  clarity: 'Clarity',
};

function clamp(value: number, min = 0.35, max = 0.95) {
  return Math.min(max, Math.max(min, value));
}

function hashScore(seed: string, min = 0.45, max = 0.9) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000000007;
  }
  const ratio = (hash % 1000) / 1000;
  return clamp(min + (max - min) * ratio);
}

export function buildModelScores(label: string, text: string, bias = 0): ScoreSet {
  const len = Math.min(1200, text.length);
  const sentenceCount = Math.max(1, text.split(/[.!?]+/).filter(Boolean).length);
  const base = hashScore(`${label}:${text}`);

  return {
    evidence: clamp(base + (len / 1200) * 0.1 + bias),
    context: clamp(base + (sentenceCount / 10) * 0.1 - bias),
    risk: clamp(base + ((len % 200) / 200) * 0.1),
    action: clamp(base + ((sentenceCount % 6) / 6) * 0.1),
    clarity: clamp(base + 0.05 - (sentenceCount > 12 ? 0.05 : 0)),
  };
}

function toPoints(scores: ScoreSet, radius: number) {
  return AXES.map((axis, idx) => {
    const angle = (Math.PI * 2 * idx) / AXES.length - Math.PI / 2;
    const value = scores[axis];
    const r = radius * value;
    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    };
  });
}

function pointsToPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return '';
  return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
}

interface ModelRadarComparisonProps {
  modelA: ScoreSet;
  modelB: ScoreSet;
  size?: number;
}

export default function ModelRadarComparison({ modelA, modelB, size = 240 }: ModelRadarComparisonProps) {
  const radius = size * 0.38;
  const pointsA = toPoints(modelA, radius);
  const pointsB = toPoints(modelB, radius);
  const labelRadius = radius + 16;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
      <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={0}
            cy={0}
            r={radius * scale}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-800"
            strokeWidth={1}
          />
        ))}
        {AXES.map((axis, idx) => {
          const angle = (Math.PI * 2 * idx) / AXES.length - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const lx = Math.cos(angle) * labelRadius;
          const ly = Math.sin(angle) * labelRadius;
          return (
            <g key={axis}>
              <line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                className="stroke-gray-200 dark:stroke-gray-800"
                strokeWidth={1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500 dark:fill-gray-400"
                fontSize="10"
              >
                {labelMap[axis]}
              </text>
            </g>
          );
        })}
        <path d={pointsToPath(pointsA)} fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth={2} />
        <path d={pointsToPath(pointsB)} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth={2} />
      </svg>
      <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
          Model A
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
          Model B
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {AXES.map((axis) => (
            <div key={axis} className="flex items-center justify-between gap-3">
              <span className="text-gray-500 dark:text-gray-400">{labelMap[axis]}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {Math.round(((modelA[axis] + modelB[axis]) / 2) * 100)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
