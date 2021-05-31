const SelectTokensFormat = ({ token }) => (
  <div className="flex flex-row items-center w-full">
    <div className="flex items-center">
      <img className="w-7.5" src={token.logoURL} />
    </div>
    <div className="ml-2.5">
      <div>{token.symbol}</div>
    </div>
  </div>
)

export default SelectTokensFormat
