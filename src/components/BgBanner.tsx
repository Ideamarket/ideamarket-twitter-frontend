import classNames from 'classnames'

type Props = {
  bgColor?: string // Include bg color or full bg color and gradient tailwind styles
  height?: string
}

// Added default bgColor and height as example here
const BgBanner = ({
  bgColor = 'bg-gradient-to-b from-[#02194D] to-[#011032]',
  height = 'h-[40rem]',
}: Props) => {
  return (
    <div
      className={classNames(bgColor, height, 'absolute top-0 w-full bg-cover')}
    ></div>
  )
}

export default BgBanner
