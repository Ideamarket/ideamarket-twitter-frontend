import { useRef, useEffect } from 'react'
import Chart from 'chart.js'

export default function PreviewPriceChart({ chartData }) {
  const ref = useRef(null)

  useEffect(() => {
    const data = chartData.map(([x, y]) => ({
      x,
      y,
    }))

    const ys = data.map(({ y }) => y)
    let min = Math.min(...ys)
    let max = Math.max(...ys)

    if (min === max) {
      min = 0.0
      max = max * 2.0
    }

    new Chart(ref.current.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          {
            data: data,
            pointRadius: 0,
            fill: false,
            borderColor: '#0857e0',
            borderWidth: 1.5,
            steppedLine: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              ticks: { display: false },
              gridLines: { display: false },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
                min: min,
                max: max,
              },
              gridLines: { display: false },
            },
          ],
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 7,
            bottom: 0,
          },
        },
      },
    })
  }, [chartData])

  return (
    <div className="h-10 max-w-xs max-h-10">
      <canvas ref={ref} className="h-10 max-w-xs max-h-10"></canvas>
    </div>
  )
}
