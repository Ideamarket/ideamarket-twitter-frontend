import classNames from 'classnames'
import Tooltip from 'components/tooltip/Tooltip'
import React, { ReactNode } from 'react'

type Header = {
  content: ReactNode | string
  value: string
  sortable: boolean
}
const headers: Header[] = [
  {
    content: '#',
    value: 'rank',
    sortable: true,
  },
  {
    content: 'Name',
    value: 'name',
    sortable: true,
  },
  {
    content: 'Price',
    value: 'price',
    sortable: true,
  },
  {
    content: 'Deposits',
    value: 'deposits',
    sortable: true,
  },
  {
    content: '% Locked',
    value: 'locked',
    sortable: true,
  },
  {
    content: '24H Change',
    value: 'change',
    sortable: true,
  },
  {
    content: '24H Volume',
    value: 'volume',
    sortable: true,
  },
  {
    content: (
      <>
        1YR
        <br />
        <div className="flex items-center">
          Income
          <Tooltip className="ml-1">
            <div className="w-32 md:w-64">
              Estimated annual passive income paid to the listing owner.
              Calculated by Deposits * Lending APY at{' '}
              <a
                href="https://compound.finance"
                target="_blank"
                className="underline"
              >
                compound.finance
              </a>
            </div>
          </Tooltip>
        </div>
      </>
    ),
    value: 'income',
    sortable: true,
  },
  {
    content: '7D Chart',
    value: 'chart',
    sortable: false,
  },
]

export const Header = ({ currentHeader, orderDirection, headerClicked }) => (
  <>
    {headers.map((header) => (
      <th
        className={classNames(
          'pl-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50',
          header.sortable && 'cursor-pointer',
          header.value !== 'rank' && 'pr-6'
        )}
        key={header.value}
        onClick={() => {
          if (header.sortable) {
            headerClicked(header.value)
          }
        }}
      >
        {header.sortable && (
          <>
            {currentHeader === header.value && orderDirection === 'asc' && (
              <span>&#x25B2;</span>
            )}
            {currentHeader === header.value && orderDirection === 'desc' && (
              <span>&#x25bc;</span>
            )}
            &nbsp;
          </>
        )}
        {header.content}
      </th>
    ))}
  </>
)
