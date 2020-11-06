import { useMemo, useCallback } from 'react'
import { Chart } from 'react-charts'

export default function PriceChart(props) {
  const data = useMemo(
    () => [
      {
        data: props.chartData,
      },
    ],
    []
  )

  const series = useMemo(
    () => ({
      showPoints: false,
    }),
    []
  )

  const axes = useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    []
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
