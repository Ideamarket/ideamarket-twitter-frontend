import { Chart } from 'chart.js'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import moment from 'moment'
import useBreakpoint from 'use-breakpoint'
import { BREAKPOINTS } from 'utils/constants'

type Props = {
  rawTokenName: string
}

const MultiChart = ({ rawTokenName }: Props) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile')

  const [viewsData, setViewsData] = useState({
    counts: [],
    dates: [],
  })
  const [trendsData, setTrendsData] = useState({
    counts: [],
    dates: [],
  })
  const [fetchViews] = useMutation<{
    message: string
    data: any
  }>(() =>
    fetch(`/api/markets/wikipedia/pageViews?title=${rawTokenName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json()
        throw new Error(response.message)
      }
      return res.json()
    })
  )

  const [fetchTrends] = useMutation<{
    message: string
    data: any
  }>(() =>
    fetch(`/api/markets/wikipedia/googleTrends?keyword=${rawTokenName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json()
        throw new Error(response.message)
      }
      return res.json()
    })
  )

  useEffect(() => {
    fetchViews().then(({ data }) => {
      const dates = data.pageViews.map((item) =>
        moment.utc(item.date, 'YYYY-MM-DD').toString()
      )
      const counts = data.pageViews.map((item) => item.count)
      setViewsData({ dates, counts })
    })
    fetchTrends().then(({ data }) => {
      const dates = data.trends.map((item) =>
        moment.utc(item.date, 'YYYY-MM-DD').toString()
      )
      const counts = data.trends.map((item) => item.count)
      setTrendsData({ dates, counts })
    })
  }, [fetchViews, fetchTrends])

  const ref = useRef(null)
  const [chart, setChart] = useState(null)

  useEffect(() => {
    if (chart) {
      chart.destroy()
    }

    setChart(
      new Chart(ref.current.getContext('2d'), {
        data: {
          labels: trendsData?.dates,
          datasets: [
            {
              type: 'line',
              label: 'Page Views',
              order: 0,
              data: viewsData?.counts,
              pointRadius: 0, // Controls whether points are shown without hover
              hoverRadius: 5,
              fill: false,
              borderWidth: 3,
              lineTension: 0.25,
              yAxisID: 'left-y-axis',
              borderColor: '#4E63F1',
            },
            {
              type: 'line',
              label: 'Google Trends',
              order: 1,
              data: trendsData?.counts,
              pointRadius: 0,
              hoverRadius: 5,
              fill: false,
              borderWidth: 3,
              lineTension: 0.25,
              yAxisID: 'right-y-axis',
              borderColor: '#0CAE74',
            },
          ],
        },
        options: {
          hover: {
            intersect: false,
          },
          animation: {
            duration: 0,
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
          },
          scales: {
            xAxes: [
              {
                // type: 'time',
                display: true,
                ticks: {
                  display: true,
                  maxTicksLimit: 14,
                  maxRotation:
                    breakpoint === 'md' ||
                    breakpoint === 'sm' ||
                    breakpoint === 'mobile'
                      ? 50
                      : 0, // Stops ticks from rotating
                  callback: function (value: string, index, values) {
                    // Set custom tick value
                    if (value.includes('Jan')) {
                      // Include year for January tick
                      return `${moment(value).format('MMM YY')}`
                    }

                    return `${moment(value).format('MMM')}`
                  },
                },
                gridLines: { display: false, drawBorder: false },
              },
            ],
            yAxes: [
              {
                id: 'left-y-axis',
                position: 'left',
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 11,
                },
              },
              {
                id: 'right-y-axis',
                position: 'right',
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 11,
                },
                gridLines: {
                  display: false, // Don't show grid lines for right-y-axis because they are not aligned with left-y-axis
                },
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
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewsData, trendsData, breakpoint])

  return (
    <div className="h-full p-5 bg-white border rounded-md dark:bg-gray-700 dark:border-gray-500 border-brand-border-gray">
      <div className="relative">
        <div
          className="flex-grow"
          style={{
            position: 'relative',
            height: '350px',
            width: '100%',
            contain: 'content',
          }}
        >
          <canvas
            ref={ref}
            style={{ display: 'block', width: '100%' }}
          ></canvas>
        </div>
      </div>
    </div>
  )
}

export default MultiChart
