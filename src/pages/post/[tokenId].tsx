import { useQuery } from 'react-query'
import {
  A,
  DefaultLayout,
  Tooltip,
  WalletModal,
  WatchingStar,
} from 'components'
import { GetServerSideProps } from 'next'
import ModalService from 'components/modals/ModalService'
import ListingSEO from 'components/listing-page/ListingSEO'
import { ReactElement, useContext, useEffect, useState } from 'react'
import {
  formatNumberInt,
  formatNumberWithCommasAsThousandsSerperator,
} from 'utils'
import { ExternalLinkIcon, ShareIcon } from '@heroicons/react/outline'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import { useWalletStore } from 'store/walletStore'
import { GlobalContext } from 'lib/GlobalContext'
import ListingContent from 'components/tokens/ListingContent'
import RateModal from 'components/trade/RateModal'
import copy from 'copy-to-clipboard'
import { getURL } from 'utils/seo-constants'
import toast from 'react-hot-toast'
import classNames from 'classnames'
import {
  getPostByTokenID,
  IdeamarketPost,
} from 'modules/posts/services/PostService'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import CitationsDataOfPost from 'modules/citations/components/CitationsDataOfPost'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import { getIMORatingColors } from 'utils/display/DisplayUtils'
import { NETWORK } from 'store/networks'

const TokenDetails = ({ rawTokenId }: { rawTokenId: string }) => {
  const { data: token, refetch } = useQuery(['single-post', rawTokenId], () =>
    getPostByTokenID({ tokenID: rawTokenId })
  )

  const { setOnWalletConnectedCallback } = useContext(GlobalContext)

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // const initializeTwitterAPI = () => {
    //   // You can add this as script tag in <head>, but for some reason that way stopped working. But this works fine for now
    //   const s = document.createElement('script')
    //   s.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    //   s.setAttribute('async', 'true')
    //   document.head.appendChild(s)
    // }

    // const timeout = setTimeout(
    //   () => (window as any)?.twttr?.widgets?.load(),
    //   3000
    // ) // Load tweets

    // initializeTwitterAPI()

    // Track using local state if page has been scrolled from top or not
    const handleElementDisplay = () => {
      const scrollAmount = window.scrollY || document.documentElement.scrollTop
      if (scrollAmount > 0) setIsScrolled(true)
      else setIsScrolled(false)
    }

    window.addEventListener('scroll', handleElementDisplay)

    return () => {
      // clearTimeout(timeout)
      window.removeEventListener('scroll', handleElementDisplay)
    }
  }, [rawTokenId])

  const { minterAddress } = (token || {}) as any

  const displayUsernameOrWallet = convertAccountName(
    token?.minterToken?.username || minterAddress
  )
  const usernameOrWallet = token?.minterToken?.username || minterAddress

  const url = token?.url

  const { data: urlMetaData } = useQuery([url], () => getURLMetaData(url))

  const copyListingPageURL = () => {
    const url = `${getURL()}/post/${token?.tokenID}`
    copy(url)
    toast.success('Copied listing page URL')
  }

  const onRateClicked = (token: IdeamarketPost, urlMetaData: any) => {
    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        ModalService.open(RateModal, { imPost: token, urlMetaData }, refetch)
      })
      ModalService.open(WalletModal)
    } else {
      ModalService.open(RateModal, { imPost: token, urlMetaData }, refetch)
    }
  }

  const postIncome = token?.totalRatingsCount * 0.001

  return (
    <div className=" mx-auto">
      <ListingSEO tokenName={rawTokenId} rawTokenName={rawTokenId} />

      <div className="max-w-[78rem] px-5 md:px-0 mt-10 mx-0 md:mx-5 xl:mx-auto text-black/[.5]">
        <A href="/" className="hover:text-blue-600">
          Market
        </A>{' '}
        / Listings
      </div>

      {/* Start of top section of listing page */}
      <div className="max-w-[50rem] mt-10 px-5 md:mx-auto">
        {/* Desktop and tablet -- top section of listing page */}
        <div className="hidden md:flex items-start w-full mt-4">
          <div className="w-[35rem] mx-auto flex items-start">
            <div className="w-full">
              {/* The actual Post card */}
              <div className="relative">
                <span
                  className={classNames(
                    'absolute bottom-0 right-0 w-28 h-6 flex justify-center items-center rounded-br-2xl rounded-tl-2xl font-extrabold text-xs bg-blue-100 text-blue-600 z-[200] cursor-pointer hover:text-blue-800'
                  )}
                >
                  <A
                    href={`https://opensea.io/assets/arbitrum/${
                      NETWORK.getDeployedAddresses().ideamarketPosts
                    }/${token?.tokenID}`}
                  >
                    Buy this NFT
                    <ExternalLinkIcon className="w-3 h-3 ml-2" />
                  </A>
                </span>

                <A
                  href={`/post/${token?.tokenID}`}
                  className={classNames(
                    'relative block px-8 pt-8 pb-10 bg-[#0857E0]/[0.05] rounded-2xl font-bold mb-2 cursor-pointer'
                  )}
                >
                  <span
                    className={classNames(
                      getIMORatingColors(
                        token?.totalRatingsCount > 0
                          ? Math.round(token?.averageRating)
                          : -1
                      ),
                      'absolute top-0 right-0 w-14 h-14 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-lg border-l-2 border-b-2 border-white'
                    )}
                  >
                    {token?.totalRatingsCount > 0
                      ? Math.round(token?.averageRating) + '%'
                      : '—'}
                  </span>

                  <div className="flex items-center whitespace-nowrap text-xs">
                    <div className="relative rounded-full w-5 h-5">
                      <Image
                        className="rounded-full"
                        src={
                          token?.minterToken?.profilePhoto ||
                          '/default-profile-pic.png'
                        }
                        alt=""
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>

                    {/* Post minter IM name/wallet and twitter name */}
                    <div className="flex items-center space-x-1 flex-wrap z-50 text-black">
                      <A
                        className="ml-1 font-medium hover:text-blue-500"
                        href={`/u/${usernameOrWallet}`}
                      >
                        {displayUsernameOrWallet}
                      </A>
                      {token?.minterToken?.twitterUsername && (
                        <A
                          className="flex items-center space-x-1 hover:text-blue-500"
                          href={`/u/${usernameOrWallet}`}
                        >
                          <div className="relative w-4 h-4">
                            <Image
                              src={'/twitter-solid-blue.svg'}
                              alt="twitter-solid-blue-icon"
                              layout="fill"
                            />
                          </div>
                          <span className="text-xs opacity-50">
                            @{token?.minterToken?.twitterUsername}
                          </span>
                        </A>
                      )}
                    </div>
                  </div>

                  <div className="py-6 border-b font-bold">
                    <ListingContent
                      imPost={token}
                      page="HomePage"
                      urlMetaData={null}
                      useMetaData={false}
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    {/* <div className="w-1/3">
                      <div className="flex justify-start items-center space-x-2">
                        <div className="relative w-6 h-6">
                          <Image
                            src={'/people-icon.svg'}
                            alt="people-icon"
                            layout="fill"
                          />
                        </div>

                        <div>
                          <div className="text-xs text-black/[.5] font-medium">
                            Ratings
                          </div>
                          <div className="font-bold">
                            {formatNumberWithCommasAsThousandsSerperator(
                              imPost.totalRatingsCount
                            )}
                          </div>
                        </div>
                      </div>
                    </div> */}

                    <div className="w-1/3">
                      <div className="flex justify-start items-center space-x-2">
                        <div className="relative w-6 h-6">
                          <Image
                            src={'/eye-icon.svg'}
                            alt="eye-icon"
                            layout="fill"
                          />
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-black/[.5] font-medium">
                              Hot
                            </div>
                            <Tooltip
                              className="text-black/[.5] z-[200]"
                              iconComponentClassNames="w-3"
                            >
                              <div className="w-64">
                                The total amount of IMO staked on all users who
                                rated a post
                              </div>
                            </Tooltip>
                          </div>
                          <div className="font-bold">
                            {formatNumberWithCommasAsThousandsSerperator(
                              Math.round(token?.marketInterest)
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/3">
                      <div className="flex justify-start items-center space-x-2">
                        <div className="relative w-6 h-6">
                          <Image
                            src={'/income-icon.svg'}
                            alt="eye-icon"
                            layout="fill"
                          />
                        </div>

                        <div>
                          <div className="text-xs text-black/[.5] font-medium">
                            Earned
                          </div>
                          <div>
                            <span className="font-bold">
                              {formatNumberWithCommasAsThousandsSerperator(
                                postIncome.toFixed(3)
                              )}
                            </span>
                            <span className="text-black/[.5] font-bold text-xs">
                              {' '}
                              (${token?.incomeInDAI?.toFixed(2)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </A>
              </div>

              <div className="mt-2">
                <OpenRateModal imPost={token} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile -- top section of listing page */}
        <div className="md:hidden flex flex-col justify-center w-full mt-4">
          <div className="flex items-start w-full">
            <div className="w-full">
              {minterAddress && (
                <div className="flex items-center pb-2 flex-wrap">
                  <div className="relative rounded-full w-6 h-6">
                    <Image
                      className="rounded-full"
                      src={
                        token?.minterToken?.profilePhoto ||
                        '/default-profile-pic.png'
                      }
                      alt=""
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <A
                    className="ml-2 font-bold hover:text-blue-600"
                    href={`/u/${usernameOrWallet}`}
                  >
                    {displayUsernameOrWallet}
                  </A>
                  {token?.minterToken?.twitterUsername && (
                    <A
                      className="flex items-center space-x-1 ml-1 z-50"
                      href={`/u/${usernameOrWallet}`}
                    >
                      <div className="relative w-4 h-4">
                        <Image
                          src={'/twitter-solid-blue.svg'}
                          alt="twitter-solid-blue-icon"
                          layout="fill"
                        />
                      </div>
                      <span className="text-sm opacity-50">
                        @{token?.minterToken?.twitterUsername}
                      </span>
                    </A>
                  )}
                </div>
              )}

              <ListingContent
                imPost={token}
                page="ListingPage"
                urlMetaData={urlMetaData}
                useMetaData={false}
              />
            </div>
          </div>

          <div className="flex flex-col items-end my-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRateClicked(token, urlMetaData)
              }}
              className="flex justify-center items-center w-full h-10 text-base font-medium text-white rounded-lg bg-black/[.8] dark:bg-gray-600 dark:text-gray-300 tracking-tightest-2"
            >
              <span>Rate</span>
            </button>

            <div className="flex justify-between items-center space-x-2 w-full mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyListingPageURL()
                }}
                className="flex justify-center items-center w-[85%] h-10 border-2 text-black text-base font-medium text-white rounded-lg hover:bg-blue-500 hover:text-white dark:text-gray-300 tracking-tightest-2"
              >
                <ShareIcon className="w-4 mr-2" />
                <span className="mb-0.5">Share</span>
              </button>

              <div className="flex justify-center items-center w-10 h-10 border-2 rounded-lg">
                {token && <WatchingStar token={token} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CitationsDataOfPost postID={rawTokenId} />

      {/* Block at bottom of mobile screen before scroll */}
      <div
        className={classNames(
          isScrolled ? 'hidden' : 'flex md:hidden',
          // shadow = 1st num is horizontal shadow length. 2nd num is vertical shadow length. 3rd num is blur amount.
          'md:hidden absolute bottom-0 left-0 right-0 flex items-center divide-x h-[12%] bg-white z-[700] shadow-[0_-2px_10px_rgba(0,0,0,0.3)]'
        )}
      >
        <div className="w-[50%] px-4 py-3 h-full">
          <div className="font-semibold text-sm text-black/[.5]">
            Average Rating
          </div>
          <div className="flex items-center">
            <span className="text-blue-600 font-semibold text-xl mr-1">
              {formatNumberInt(token?.averageRating)}
            </span>
            <span className="text-sm text-black/[.5]">
              ({token?.latestRatingsCount})
            </span>
          </div>
        </div>

        <div className="w-[50%] px-4 py-3 h-full">
          <div className="font-semibold text-sm text-black/[.5]">Ratings</div>
          <div className="flex items-center font-medium">
            <div className="relative w-6 h-6">
              <Image src={'/people-icon.svg'} alt="people-icon" layout="fill" />
            </div>
            {token?.totalRatingsCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      rawTokenId: context.query.tokenId,
    },
  }
}

TokenDetails.getLayout = (page: ReactElement) => (
  <DefaultLayout
    bgColor="bg-[#F6F6F6] dark:bg-gray-900"
    bgHeaderColor="bg-transparent"
    headerTextColor="text-black"
  >
    {page}
  </DefaultLayout>
)

export default TokenDetails
