import React, { useState } from 'react'

import Plus from '../../assets/plus-white.svg'
import Play from '../../assets/play.svg'

type Props = {
  setIsPromoVideoModalOpen: (open: boolean) => void
  onListTokenClicked: () => void
}

export const HeaderButtons = ({
  setIsPromoVideoModalOpen,
  onListTokenClicked,
}: Props) => {
  const [isHoveringWatchVideo, setIsHoveringWatchVideo] = useState(false)

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={() => {
          setIsPromoVideoModalOpen(true)
        }}
        onMouseEnter={() => {
          setIsHoveringWatchVideo(true)
        }}
        onMouseLeave={() => {
          setIsHoveringWatchVideo(false)
        }}
        className="py-2 text-lg text-white border border-white rounded-lg w-44 font-sf-compact-medium hover:bg-white hover:text-black hover:font-bold"
      >
        <div className="flex flex-row items-center justify-center">
          <Play
            width="30"
            height="30"
            stroke={isHoveringWatchVideo ? '#000000' : '#ffffff'}
          />
          <div className="ml-0.5 md:ml-2">
            <div className="flex">
              Watch<div className="hidden md:block">&nbsp;Video</div>
            </div>
          </div>
        </div>
      </button>

      <button
        onClick={() => {
          onListTokenClicked()
        }}
        className="py-2 ml-5 text-lg font-bold text-white rounded-lg w-44 font-sf-compact-medium bg-brand-blue hover:bg-blue-800"
      >
        <div className="flex flex-row items-center justify-center">
          <Plus width="30" height="30" />
          <div className="ml-0.5 md:ml-2">Add Listing</div>
        </div>
      </button>
    </div>
  )
}
