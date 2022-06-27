import CitationsDataOfPost from 'modules/citations/components/CitationsDataOfPost'

type Props = {
  postID: string
}

const IMPostOverlay = ({ postID }: Props) => {
  return (
    <div className="fixed right-0 w-[30rem] h-screen bg-white">
      <CitationsDataOfPost postID={postID} isMobile={true} />
    </div>
  )
}

export default IMPostOverlay
