import Tooltip from 'components/tooltip/Tooltip'

const PnlTitleWithTooltip = () => (
  <div className="flex">
    PNL
    <Tooltip className="ml-2">
      <div className="w-32 md:w-64">
        PnL stands for profit and loss, and it can be either realized or
        unrealized. When you have open positions, your PnL is unrealized,
        meaning it changes with market movements.
      </div>
    </Tooltip>
  </div>
)

export default PnlTitleWithTooltip
