import InitTwitterLoginModal from 'components/account/InitTwitterLoginModal'
import ModalService from 'components/modals/ModalService'
import { GlobalContext } from 'lib/GlobalContext'
import NewOpinionModal from 'modules/posts/components/NewOpinionModal'
import { IdeamarketPost } from 'modules/posts/services/PostService'
import { IdeamarketTwitterPost } from 'modules/posts/services/TwitterPostService'
import Slider, { Handle } from 'rc-slider'
import { useContext } from 'react'

type Props = {
  imPost: IdeamarketPost | IdeamarketTwitterPost
}

const OpenRateModal = ({ imPost }: Props) => {
  const { jwtToken } = useContext(GlobalContext)

  const onRateDragged = (draggedPost: any, inputValue: number) => {
    if (!jwtToken) {
      ModalService.open(InitTwitterLoginModal)
    } else {
      ModalService.open(NewOpinionModal, {
        defaultRatedPost: draggedPost,
        defaultRating: inputValue,
      })
    }
  }

  return (
    <div className="w-full relative flex items-center h-16 bg-white rounded-2xl border">
      <div className="absolute top-1 left-2 text-xs opacity-50">Disagree</div>
      <Slider
        className=""
        defaultValue={50}
        onAfterChange={(value) => {
          onRateDragged(imPost, value)
        }}
        // marks={sliderMarks}
        step={1}
        min={0}
        max={100}
        // tipFormatter={(value) => {
        //   return `${value}`
        // }}
        handle={(handleProps: any) => {
          return (
            <Handle
              {...handleProps}
              dragging={handleProps?.dragging?.toString()}
            >
              <div className="absolute -top-1 -left-6 w-[3.5rem] h-[2rem] rounded-2xl text-white bg-blue-600 flex justify-center items-center">
                Drag
              </div>
            </Handle>
          )
        }}
        railStyle={{
          height: '20px',
          borderRadius: 0,
          color: 'red',
          backgroundColor: 'rgb(8 87 224 / 0.05)',
        }}
        trackStyle={{
          height: '20px',
          borderRadius: 0,
          background: 'transparent',
        }}
        style={{ padding: 0, left: '0px' }}
      />
      <div className="absolute top-1 right-2 text-xs opacity-50">Agree</div>
    </div>
  )
}

export default OpenRateModal
