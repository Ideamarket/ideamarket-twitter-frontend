type Props = {
  columnData: Array<any>
}

/**
 * This method controls width of columns dynamically
 */
const ColSize = ({ columnData }: Props) => {
  /**
   * This method defines width of columns
   */
  const getColumnWidth = (column: any): string => {
    switch (column.value) {
      case 'name':
        return '35%'
      case 'price':
        return '8%'
      case 'dayChange':
        return '8%'
      case 'weekChange':
        return '8%'
      case 'deposits':
        return '8%'
      case 'claimable':
        return '8%'
      case 'totalVotes':
        return '13%'
      case 'chevron':
        return '4%'
    }
  }

  return (
    <>
      {columnData.map((column) => {
        return <col width={getColumnWidth(column)} />
      })}
    </>
  )
}

export default ColSize
