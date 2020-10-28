import { useMemo, useCallback } from 'react'
import { Chart } from 'react-charts'

export default function PreviewPriceChart(props) {
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
      { primary: true, type: 'time', position: 'bottom', show: false },
      { type: 'linear', position: 'left', show: false },
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
    <div
      style={{
        width: '100px',
        height: '50px',
      }}
    >
      <Chart
        series={series}
        getSeriesStyle={getSeriesStyle}
        data={data}
        axes={axes}
      />
    </div>
  )
}
