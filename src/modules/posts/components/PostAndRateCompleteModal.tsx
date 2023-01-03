import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { Modal } from 'components'
// import A from 'components/A'
import { GlobalContext } from 'lib/GlobalContext'
import Image from 'next/image'
import { useContext } from 'react'
import Wrong from '../../../assets/SomethingWentWrong.svg'
// import TwitterCircleIcon from '../../assets/TwitterCircleIcon.svg'

export enum TX_TYPES {
  NONE,
  RATE,
  URL_POST,
  WITHDRAW_CLAIMABLE_FEE,
}

// const tweetableTypes = [
//   TX_TYPES.LIST,
//   TX_TYPES.GHOST_LIST,
//   TX_TYPES.BUY,
//   TX_TYPES.LOCK,
//   TX_TYPES.UNLOCK,
//   TX_TYPES.GIFT,
//   TX_TYPES.CLAIM,
//   TX_TYPES.STAKE,
//   TX_TYPES.RATE,
//   TX_TYPES.WITHDRAW_CLAIMABLE_FEE,
// ]

// const getTweetTemplate = (txType: TX_TYPES, value: string) => {
//   let tweetText = ''

//   if (txType === TX_TYPES.LIST) {
//     tweetText = `Just listed ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.GHOST_LIST) {
//     tweetText = `Just ghost listed ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.BUY) {
//     tweetText = `Just bought ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.LOCK) {
//     tweetText = `Just locked ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.UNLOCK) {
//     tweetText = `Just unlocked ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.GIFT) {
//     tweetText = `Just gifted ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.CLAIM) {
//     tweetText = `Just claimed $IMO token airdrop on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.STAKE) {
//     tweetText = `Just staked $IMO tokens on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.RATE) {
//     tweetText = `Just rated ${value} on @ideamarket_io, the literal marketplace of ideas!`
//   } else if (txType === TX_TYPES.WITHDRAW_CLAIMABLE_FEE) {
//     tweetText = `Just earned $${value} on @ideamarket_io`
//   }

//   return encodeURIComponent(tweetText)
// }

// const getTweetUrl = (txType: TX_TYPES, value: string) => {
//   let tweetUrl = 'https://ideamarket.io'

//   if (
//     txType === TX_TYPES.LIST ||
//     txType === TX_TYPES.BUY ||
//     txType === TX_TYPES.LOCK ||
//     txType === TX_TYPES.UNLOCK ||
//     txType === TX_TYPES.GIFT ||
//     txType === TX_TYPES.RATE
//   ) {
//     tweetUrl = `https://ideamarket.io/post/${value}`
//   } else if (txType === TX_TYPES.CLAIM) {
//     tweetUrl = `https://ideamarket.io/claim`
//   } else if (txType === TX_TYPES.STAKE) {
//     tweetUrl = `https://ideamarket.io/stake`
//   } else if (txType === TX_TYPES.WITHDRAW_CLAIMABLE_FEE) {
//     tweetUrl = `` // No link for now
//   }

//   return tweetUrl
// }

export default function PostAndRateCompleteModal({
  close,
  isSuccess,
  txType,
  onStakeClicked,
}: {
  close: () => void
  isSuccess: boolean
  listingId: string
  idtValue: string // Value stored onchain for this IDT
  txType: TX_TYPES
  onStakeClicked?: () => void
}) {
  const { user } = useContext(GlobalContext)
  // const tweetTemplate = getTweetTemplate(txType, idtValue)
  // const tweetUrl = getTweetUrl(txType, listingId)

  // const canTweet = tweetableTypes.includes(txType)

  const bgImageURL = isSuccess ? '/txSuccess.png' : '/txFail.png'

  return (
    <Modal className="bg-transparent" close={close}>
      <div
        className="relative w-full md:w-120 px-2.5 py-5"
        style={{
          backgroundImage: `url("${bgImageURL}"), linear-gradient(180deg, #011032 0%, #02194D 100%)`,
          backgroundSize: 'cover',
          height: '300px',
        }}
      >
        {txType === TX_TYPES.WITHDRAW_CLAIMABLE_FEE && (
          <>
            {isSuccess ? (
              <div className="flex flex-col justify-center items-center">
                {/* {canTweet && (
                  <div className="flex justify-center mt-10">
                    <A
                      className="twitter-share-button"
                      href={`https://twitter.com/intent/tweet?text=${tweetTemplate}&url=${tweetUrl}`}
                    >
                      <button
                        className="w-36 h-10 text-white rounded-2xl flex justify-center items-center font-bold"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(100px)',
                        }}
                      >
                        Send Tweet
                        <TwitterCircleIcon className="w-5 h-5 ml-2" />
                      </button>
                    </A>
                  </div>
                )} */}
              </div>
            ) : (
              <>
                <Wrong
                  style={{
                    width: '19rem',
                    height: '16rem',
                    position: 'absolute',
                    top: -40,
                  }}
                />
                <div
                  className="mt-36 px-4 py-2 text-white rounded-2xl flex justify-center items-center"
                  style={{
                    background: 'rgba(199, 43, 67, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(100px)',
                  }}
                >
                  <ExclamationCircleIcon className="w-5 h-5 text-red-700 mr-2" />
                  Submission Failed
                </div>
              </>
            )}
          </>
        )}

        {txType === TX_TYPES.RATE && (
          <>
            {isSuccess ? (
              <>
                <div className="pt-8 flex justify-center text-4xl text-white text-center font-gilroy-bold">
                  Rated Successfully!
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-44 py-5 text-white flex justify-center items-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(100px)',
                  }}
                >
                  <div>
                    <div className="text-sm px-4">
                      Next, stake $IMO on yourself to increase the visibility of
                      every post you rate. The more users who rate the same
                      posts as you, the more you’ll be recommended as a “Similar
                      User” on other user's profiles. No need to buy $IMO first,
                      we'll convert it for you.
                    </div>

                    <div className="w-full flex justify-center items-center">
                      <button
                        onClick={onStakeClicked}
                        className="mt-3 p-2 bg-blue-600 rounded-xl font-bold text-sm flex justify-center items-center"
                      >
                        <div className="relative rounded-full w-5 h-5 mr-2">
                          <Image
                            className="rounded-full"
                            src={
                              user?.twitterProfilePicURL ||
                              '/default-profile-pic.png'
                            }
                            alt=""
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <span>Stake on Yourself</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Wrong
                  style={{
                    width: '19rem',
                    height: '16rem',
                    position: 'absolute',
                    top: -40,
                  }}
                />
                <div
                  className="mt-36 px-4 py-2 text-white rounded-2xl flex justify-center items-center"
                  style={{
                    background: 'rgba(199, 43, 67, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(100px)',
                  }}
                >
                  <ExclamationCircleIcon className="w-5 h-5 text-red-700 mr-2" />
                  Submission Failed
                </div>
              </>
            )}
          </>
        )}

        {txType !== TX_TYPES.WITHDRAW_CLAIMABLE_FEE &&
          txType !== TX_TYPES.RATE && (
            <div className="flex flex-col justify-center items-center">
              {isSuccess ? (
                <>
                  <div className="flex justify-center text-3xl text-white text-center font-gilroy-bold">
                    Submission
                    <br />
                    Successful!
                  </div>
                  {/* {canTweet && (
                    <div className="flex justify-center mt-10">
                      <A
                        className="twitter-share-button"
                        href={`https://twitter.com/intent/tweet?text=${tweetTemplate}&url=${tweetUrl}`}
                      >
                        <button
                          className="w-32 h-10 text-white rounded-2xl flex justify-center items-center"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(100px)',
                          }}
                        >
                          Share
                          <TwitterCircleIcon className="w-5 h-5 ml-2" />
                        </button>
                      </A>
                    </div>
                  )} */}
                </>
              ) : (
                <>
                  <Wrong
                    style={{
                      width: '19rem',
                      height: '16rem',
                      position: 'absolute',
                      top: -40,
                    }}
                  />
                  <div
                    className="mt-36 px-4 py-2 text-white rounded-2xl flex justify-center items-center"
                    style={{
                      background: 'rgba(199, 43, 67, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(100px)',
                    }}
                  >
                    <ExclamationCircleIcon className="w-5 h-5 text-red-700 mr-2" />
                    Transaction Failed to execute
                  </div>

                  <div className="text-sm text-white px-4 pt-2">
                    If this happens again, try switching MetaMask's network to
                    Ethereum Mainnet and then back to Arbitrum. Thanks for
                    bearing with us as we settle in to Arbitrum's new Nitro
                    upgrade.
                  </div>
                </>
              )}
            </div>
          )}
      </div>
    </Modal>
  )
}
