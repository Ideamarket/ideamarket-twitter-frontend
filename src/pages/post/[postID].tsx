import { useQuery } from 'react-query'
import { A, DefaultLayout } from 'components'
import { GetServerSideProps } from 'next'
import ListingSEO from 'components/listing-page/ListingSEO'
import { ReactElement, useContext, useEffect, useState } from 'react'
import {
  formatNumberInt,
  formatNumberWithCommasAsThousandsSerperator,
} from 'utils'
import { ShareIcon } from '@heroicons/react/outline'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import ListingContent from 'components/tokens/ListingContent'
import copy from 'copy-to-clipboard'
import { getURL } from 'utils/seo-constants'
import toast from 'react-hot-toast'
import classNames from 'classnames'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import CitationsDataOfPost from 'modules/citations/components/CitationsDataOfPost'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import {
  getTwitterPostByPostID,
  IdeamarketTwitterPost,
} from 'modules/posts/services/TwitterPostService'
import { GlobalContext } from 'lib/GlobalContext'
import ModalService from 'components/modals/ModalService'
import InitTwitterLoginModal from 'components/account/InitTwitterLoginModal'
import NewOpinionModal from 'modules/posts/components/NewOpinionModal'

const TokenDetails = ({ postID }: { postID: string }) => {
  const { isTxPending, jwtToken } = useContext(GlobalContext)
  const { data: imPost /*refetch*/ } = useQuery(
    ['single-post', postID, isTxPending],
    () => getTwitterPostByPostID({ postID })
  )

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // const initializeTwitterAPI = () => {
    //   // You can add this as script tag in <head>, but for some reason that way stopped working. But this works fine for now
    //   const s = document.createElement('script')
    //   s.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    //   s.setAttribute('async', 'true')
    //   document.head.appendChild(s)
    // }

    const timeout = setTimeout(
      () => (window as any)?.twttr?.widgets?.load(),
      1000
    ) // Load tweets

    // initializeTwitterAPI()

    // Track using local state if page has been scrolled from top or not
    const handleElementDisplay = () => {
      const scrollAmount = window.scrollY || document.documentElement.scrollTop
      if (scrollAmount > 0) setIsScrolled(true)
      else setIsScrolled(false)
    }

    window.addEventListener('scroll', handleElementDisplay)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('scroll', handleElementDisplay)
    }
  }, [postID])

  const { minterAddress } = (imPost || {}) as any

  const displayUsernameOrWallet = convertAccountName(
    // imPost?.minterToken?.username || minterAddress
    'test'
  )
  // const usernameOrWallet = imPost?.minterToken?.username || minterAddress
  const usernameOrWallet = 'test'

  const url = imPost?.content

  const { data: urlMetaData } = useQuery([url], () => getURLMetaData(url))

  const copyListingPageURL = () => {
    const url = `${getURL()}/post/${imPost?.postID}`
    copy(url)
    toast.success('Copied listing page URL')
  }

  const onRateClicked = (post: IdeamarketTwitterPost) => {
    if (!jwtToken) {
      ModalService.open(InitTwitterLoginModal)
    } else {
      ModalService.open(NewOpinionModal, { defaultRatedPost: post })
    }
  }

  return (
    <div className=" mx-auto">
      <ListingSEO tokenName={postID} rawTokenName={postID} />

      <div className="max-w-[78rem] px-5 md:px-0 mt-10 mx-0 md:mx-5 xl:mx-auto text-black/[.5]">
        <A href="/" className="hover:text-blue-600">
          Home
        </A>{' '}
        / Posts
      </div>

      {/* Start of top section of listing page */}
      <div className="max-w-[50rem] mt-10 px-5 md:mx-auto">
        {/* Desktop and tablet -- top section of listing page */}
        <div className="hidden md:flex items-start w-full mt-4">
          <div className="w-[35rem] mx-auto flex items-start">
            <div className="w-full">
              {/* The actual Post card */}
              <div className="relative">
                <A
                  href={`/post/${imPost?.postID}`}
                  className="relative block px-8 pt-4 pb-6 bg-[#0857E0]/[0.05] border-2 border-[#0857E0]/[0.05] hover:border-blue-600  rounded-2xl cursor-pointer"
                >
                  <div className="py-6 border-b font-bold">
                    <ListingContent
                      imPost={imPost}
                      page="HomePage"
                      urlMetaData={null}
                      useMetaData={false}
                      key={imPost?.postID}
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <div className="w-1/3">
                      <div className="flex justify-start items-center space-x-2">
                        {/* <div className="relative w-6 h-6">
                          <Image
                            src={'/eye-icon.svg'}
                            alt="eye-icon"
                            layout="fill"
                          />
                        </div> */}

                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-black/[.5] font-medium">
                              # ratings
                            </div>
                          </div>
                          <div className="font-bold">
                            {formatNumberWithCommasAsThousandsSerperator(
                              Math.round(imPost?.latestRatingsCount)
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/3">
                      <div className="flex justify-start items-center space-x-2">
                        {/* <div className="relative w-6 h-6">
                          <Image
                            src={'/eye-icon.svg'}
                            alt="eye-icon"
                            layout="fill"
                          />
                        </div> */}

                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-black/[.5] font-medium">
                              Average Rating
                            </div>
                          </div>
                          <div className="font-bold">
                            {imPost?.latestRatingsCount > 0
                              ? formatNumberWithCommasAsThousandsSerperator(
                                  Math.round(imPost?.averageRating)
                                )
                              : '-'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/3"></div>
                  </div>
                </A>
              </div>

              <div className="mt-2">
                <OpenRateModal imPost={imPost as any} />
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
                        imPost?.userToken?.twitterProfilePicURL ||
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
                  {imPost?.userToken?.twitterUsername && (
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
                        @{imPost?.userToken?.twitterUsername}
                      </span>
                    </A>
                  )}
                </div>
              )}

              <ListingContent
                imPost={imPost}
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
                onRateClicked(imPost)
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
                className="flex justify-center items-center w-full h-10 border-2 text-black text-base font-medium text-white rounded-lg hover:bg-blue-500 hover:text-white dark:text-gray-300 tracking-tightest-2"
              >
                <ShareIcon className="w-4 mr-2" />
                <span className="mb-0.5">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CitationsDataOfPost postID={postID} key={postID} />

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
              {formatNumberInt(imPost?.averageRating)}
            </span>
            {/* <span className="text-sm text-black/[.5]">
              ({imPost?.latestRatingsCount})
            </span> */}
          </div>
        </div>

        <div className="w-[50%] px-4 py-3 h-full">
          <div className="font-semibold text-sm text-black/[.5]">Ratings</div>
          <div className="flex items-center font-medium">
            <div className="relative w-6 h-6">
              <Image src={'/people-icon.svg'} alt="people-icon" layout="fill" />
            </div>
            {imPost?.latestRatingsCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      postID: context.query.postID,
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
