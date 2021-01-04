import { useMemo, useEffect, useRef } from 'react'
import Chart from 'chart.js'

export default function LockedTokenChart({ chartData }) {
  const labels = useMemo(
    () => chartData.map((pair) => parseInt(pair[0]) * 1000),
    []
  )
  const data = useMemo(() => chartData.map((pair) => parseFloat(pair[1])), [])

  const ref = useRef(null)

  useEffect(() => {
    let min = Math.min(...data)
    let max = Math.max(...data)

    if (min === max) {
      min = 0.0
      max = max * 2.0
    }

    new Chart(ref.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            pointRadius: 0,
            fill: false,
            borderColor: '#0857e0',
            lineTension: 0,
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: { display: false },
              gridLines: { display: true, drawBorder: false },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
                min: min,
                max: max,
              },
              gridLines: { display: true, drawBorder: false },
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
  }, [labels, data])

  return (
    <div className="flex-grow">
      <canvas ref={ref}></canvas>
    </div>
  )
}
