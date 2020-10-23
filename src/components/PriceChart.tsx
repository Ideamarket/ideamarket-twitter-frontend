import { useMemo } from 'react'
import { Chart } from 'react-charts'

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

type DayPricePoint = {
  timestamp: number
  price: number
}

export default function PriceChart() {
  const NUMBER_OF_DATA_POINTS = 10
  const pricePoints: DayPricePoint[] = []

  for (let i = 0; i < NUMBER_OF_DATA_POINTS; i++) {
    pricePoints.push({
      timestamp: randomDate(new Date(2019, 7, 1), new Date()).getTime(),
      price: Math.random() * 1000,
    })
  }
  pricePoints.sort((a, b) => a.timestamp - b.timestamp)

  const data = useMemo(
    () => [
      {
        data: pricePoints.map((pricePoint) => [
          pricePoint.timestamp,
          pricePoint.price,
        ]),
      },
    ],
    []
  )

  const axes = useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom', show: false },
      { type: 'linear', position: 'left', show: false },
    ],
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
      <Chart data={data} axes={axes} />
    </div>
  )
}
