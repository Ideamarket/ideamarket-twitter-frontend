import { DefaultLayout } from '../components'
import Select from 'react-select'
import CopyIcon from '../assets/copy-check.svg'
import CopyCheck from '../assets/copy-icon.svg'
import { useState, useEffect } from 'react'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { useQuery } from 'react-query'
import { queryMarkets } from 'store/ideaMarketsStore'
import { Target } from 'puppeteer-core'

export default function Embed() {
  const [selectMarketValues, setSelectMarketValues] = useState([])

  const { data: markets, isLoading: isMarketsLoading } = useQuery(
    'all-markets',
    queryMarkets
  )

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]
  const [tagName, setTagname] = useState('elonmusk')
  const [market, setMarket] = useState('twitter')
  const [ewidth, setWidth] = useState('432')
  const [eheight, setHeight] = useState('243')
  const [embedsize, setSize] = useState('small')
  const [copyDone, setCopyDone] = useState(false)

  useEffect(() => {
    if (markets) {
      setSelectMarketValues(
        markets
          .filter(
            (market) =>
              getMarketSpecificsByMarketName(market.name) !== undefined &&
              getMarketSpecificsByMarketName(market.name).isEnabled()
          )
          .map((market) => ({
            value: market.marketID.toString(),
            market: market,
          }))
      )
    } else {
      setSelectMarketValues([])
    }
  }, [markets])
  const embed = `<iframe src="https://app.ideamarket.io/iframe/${market}/${tagName}" width=${ewidth} height=${eheight}></iframe> `

  const selectMarketFormat = (entry) => <option> {entry.market.name} </option>

  const createEmbed = (event) => {
    event.preventDefault()
    if (embedsize === 'medium') {
      setWidth('544')
      setHeight('306')
    } else if (embedsize === 'large') {
      setWidth('640')
      setHeight('360')
    } else {
      setWidth('432')
      setHeight('243')
    }
    setCopyDone(false)
  }

  return (
    <>
      <div className="overflow-x-hidden bg-brand-gray">
        <div className="w-screen px-6 pt-10 pb-40 text-center mb-40  md:mb-5 text-white bg-cover bg-top-mobile md:bg-top-desktop">
          <div>
            <h2 className="text-3xl md:text-6xl font-gilroy-bold">
              Tuning into what <span className="text-brand-blue">matters</span>
            </h2>
            <p className="mt-6 text-lg md:text-2xl font-sf-compact-medium">
              Allow people to voice their trust by embeding ideamarket social
            </p>
          </div>
          <div className="flex  mt-14 flex-col items-center justify-center  text-md md:text-3xl font-gilroy-bold md:flex-row">
            <form
              className="w-full max-w-lg"
              action="POST"
              onSubmit={createEmbed}
            >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Name
                  </label>
                  <input
                    className="appearance-none block w-full text-lg bg-gray-200 text-gray-700 border rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
                    id="tagname"
                    name="tagname"
                    type="text"
                    placeholder="naval"
                    value={tagName}
                    onChange={({ target }) => setTagname(target.value)}
                  ></input>
                </div>
                <div className="w-full md:w-1/3 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="grid-last-name"
                  >
                    Market
                  </label>

                  <Select
                    value={market}
                    onChange={({ target }) => setMarket(target)}
                    options={selectMarketValues}
                    formatOptionLabel={selectMarketFormat}
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 text-lg  rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    defaultInputValue="twitter"
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 ">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold  mb-2"
                    htmlFor="grid-last-name"
                  >
                    Size
                  </label>

                  <Select
                    options={sizeOptions}
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 text-lg  rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    defaultInputValue="small"
                  ></Select>
                </div>
              </div>
              <button
                className="py-2 -mt-2 ml-5 text-lg font-bold text-white rounded-md w-44 font-sf-compact-medium bg-brand-blue hover:bg-blue-800"
                type="submit"
              >
                <div className="flex flex-row items-center justify-center">
                  <div>Generate</div>
                </div>
              </button>
            </form>
          </div>

          <div className="mx-5 m-20 grid place-content-center">
            <iframe
              src={`http://localhost:3000/iframe/${market}/${tagName}`}
              width={ewidth}
              height={eheight}
              title="preview"
              className="shadow-lg border-2 border-indigo-100 rounded-sm "
            ></iframe>

            <div className="flex justify-center items-center sm:mt-24 mb:mt-0">
              <dialog
                open
                className="rounded-2xl overflow-hidden p-0 w-auto max-w-7xl md:mx-auto md:w-1/2 shadow-lg m-8 mt-52"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold mb-6">
                          Generated code
                        </h3>

                        <button
                          className="outline-none   focus:outline-none  border-gray-200 w-8 h-8 hover:text-green-500 active:bg-gray-50"
                          onClick={() => {
                            setCopyDone(true)
                          }}
                        >
                          {copyDone ? (
                            <CopyIcon className="w-6 h-6" />
                          ) : (
                            <CopyCheck className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-md">
                        <textarea
                          className="w-full px-3 py-1 border border-gray-200  rounded-md focus:outline-none resize-none"
                          value={embed}
                          rows={2}
                          onChange={(e) => {
                            e.preventDefault()
                          }}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
Embed.layoutProps = {
  Layout: DefaultLayout,
}
