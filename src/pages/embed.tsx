import React, { useState } from 'react'
import { DefaultLayout } from '../components'
export default function Embed() {
  const [tagName, setTagname] = useState('elonmusk')
  const [market, setMarket] = useState('twitter')
  const [ewidth, setWidth] = useState('432')
  const [eheight, setHeight] = useState('243')
  const [embedsize, setSize] = useState('small')
  const [copyDone, setCopyDone] = useState(false)

  var embed = `<iframe src="https://app.ideamarket.io/iframe/${market}/${tagName}" width=${ewidth} height=${eheight}></iframe> `

  const copyCheckIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path
        fillRule="evenodd"
        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )

  const copyIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
  )

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
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="market"
                    name="market"
                    value={market}
                    onChange={({ target }) => setMarket(target.value)}
                    placeholder="Select market"
                  >
                    <option>twitter</option>
                    <option>youtube</option>
                    <option>substack</option>
                  </select>
                </div>
                <div className="w-full md:w-1/3 px-3 ">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold  mb-2"
                    htmlFor="grid-last-name"
                  >
                    Size
                  </label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="market"
                    name="market"
                    value={embedsize}
                    onChange={({ target }) => setSize(target.value)}
                    placeholder="Select market"
                  >
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                  </select>
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

          <div className="mx-5 m-10 grid place-content-center">
            <iframe
              src={`http://localhost:3000/iframe/${market}/${tagName}`}
              width={ewidth}
              height={eheight}
              title="preview"
              className="shadow-lg border-2 border-indigo-100 rounded-sm"
            ></iframe>

            <div className="flex justify-center items-center sm:mt-24 mb:mt-0">
              <dialog
                open
                className="rounded-2xl overflow-hidden p-0 w-auto max-w-7xl md:mx-auto md:w-1/2 shadow-lg m-8"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold mb-6">
                          Generated code
                        </h3>

                        <button
                          className="outline-none   focus:outline-none  border-gray-200 w-10 h-10 hover:text-green-500 active:bg-gray-50"
                          onClick={() => {
                            setCopyDone(true)
                            console.log('copied!')
                          }}
                        >
                          {copyDone ? copyCheckIcon : copyIcon}
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
