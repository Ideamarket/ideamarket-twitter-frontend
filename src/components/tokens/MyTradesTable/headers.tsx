import PnlTitleWithTooltip from './components/PnlTitleWithTooltip'

type Header = {
  title: string | React.ReactNode
  value: string
  sortable: boolean
}

const headers: Header[] = [
  {
    title: '',
    value: 'market',
    sortable: false,
  },
  {
    title: 'Name',
    value: 'name',
    sortable: false,
  },
  {
    title: 'Type',
    value: 'type',
    sortable: true,
  },
  {
    title: 'Amount',
    value: 'amount',
    sortable: true,
  },
  {
    title: 'Purchase Value',
    value: 'purchaseValue',
    sortable: true,
  },
  {
    title: 'Current Value',
    value: 'currentValue',
    sortable: true,
  },
  {
    title: <PnlTitleWithTooltip />,
    value: 'pln',
    sortable: false,
  },
  {
    title: 'Date',
    value: 'date',
    sortable: true,
  },
]

export default headers
