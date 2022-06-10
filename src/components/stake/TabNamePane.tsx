import classNames from 'classnames'
import { STAKE_TYPES } from 'pages/stake'
import { useEffect, useState } from 'react'

type Props = {
  stakeType: STAKE_TYPES
  onClickStakeType: (s: STAKE_TYPES) => void
}

export default function TabNamePane({ stakeType, onClickStakeType }: Props) {
  const [lpAPR, setLpAPR] = useState(undefined)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_IDEAMARKET_BACKEND_HOST}/general/lp-apr`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLpAPR(Number(data.data.apr))
        } else setLpAPR(0)
      })
      .catch(() => setLpAPR(0))
  }, [])

  return (
    <div
      className="grid text-white font-gilroy-bold pt-20 overflow-auto"
      style={{
        background: 'linear-gradient(180deg, #011032 0%, #02194D 100%)',
        gridTemplateColumns: 'repeat(3, minmax(12rem, 1fr))',
      }}
    >
      <div
        className={classNames(
          'flex flex-col lg:flex-row items-center m-auto pb-6 border-brand-light-green cursor-pointer px-2 min-w-[15rem]',
          stakeType === STAKE_TYPES.IMO ? 'border-b-4' : 'border-b-none'
        )}
        onClick={() => onClickStakeType(STAKE_TYPES.IMO)}
      >
        <h3
          className={classNames(
            'text-3xl whitespace-nowrap',
            stakeType === STAKE_TYPES.IMO ? '' : 'opacity-50'
          )}
        >
          Unstake IMO
        </h3>
      </div>
      <div
        className={classNames(
          'flex flex-col lg:flex-row items-center m-auto pb-6 border-brand-light-green cursor-pointer px-2 min-w-[15rem]',
          stakeType === STAKE_TYPES.ETH_IMO ? 'border-b-4' : 'border-b-none'
        )}
        onClick={() => onClickStakeType(STAKE_TYPES.ETH_IMO)}
      >
        <h3
          className={classNames(
            'text-3xl whitespace-nowrap',
            stakeType === STAKE_TYPES.ETH_IMO ? '' : 'opacity-50'
          )}
        >
          Stake ETH-IMO
        </h3>
        <span
          className={classNames(
            'text-xl px-3 py-1 ml-2 rounded-lg',
            stakeType === STAKE_TYPES.ETH_IMO
              ? 'bg-brand-light-green'
              : 'text-brand-light-green'
          )}
        >
          {lpAPR}% APR
        </span>
      </div>
    </div>
  )
}
