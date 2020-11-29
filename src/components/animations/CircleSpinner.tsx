export default function CircleSpinner({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 animate-spin"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        style={{
          fill: 'transparent',
          stroke: color,
          strokeWidth: '10',
        }}
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        style={{
          fill: 'transparent',
          stroke: 'white',
          strokeWidth: '10',
          strokeDasharray: '283',
          strokeDashoffset: '75',
        }}
      />
    </svg>
  )
}
