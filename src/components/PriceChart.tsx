import { useMemo, useCallback } from 'react'
import { Chart } from 'react-charts'

export default function PriceChart({ chartData }) {
  const data = useMemo(() => {
    return [
      {
        data: chartData.map((x) => [parseInt(x[0]) * 1000, x[1]]),
      },
    ]
  }, [chartData])

  const series = useMemo(
    () => ({
      showPoints: false,
    }),
    []
  )

  const axes = useMemo(
    () => [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    [chartData]
  )

  const getSeriesStyle = useCallback(
    (series) => ({
      color: '#0857e0',
    }),
    []
  )

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <Chart
      series={series}
      getSeriesStyle={getSeriesStyle}
      data={data}
      axes={axes}
    />
  )
}
