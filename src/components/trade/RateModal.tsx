import { Modal } from 'components'
import ModalService from 'components/modals/ModalService'
import TradeCompleteModal, { TX_TYPES } from './TradeCompleteModal'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useContext, useState } from 'react'
import classNames from 'classnames'
import { useTransactionManager } from 'utils'
import TxPending from './TxPending'
import ratePost from 'actions/web3/ratePost'
import { convertAccountName } from 'lib/utils/stringUtil'
import A from 'components/A'
import { useQuery } from 'react-query'
import Image from 'next/image'
import { syncNFTOpinions } from 'actions/web2/opinions/syncNFTOpinions'
import { GlobalContext } from 'lib/GlobalContext'
import ListingContent from 'components/tokens/ListingContent'
import {
  getListingTypeFromIDTURL,
  LISTING_TYPE,
} from 'components/tokens/utils/ListingUtils'
import { getAccount } from 'actions/web2/user-market/apiUserActions'
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import AddCitationModal from 'modules/posts/components/AddCitationModal'
import { IdeamarketPost } from 'modules/posts/services/PostService'
import IMTextArea from 'modules/forms/components/IMTextArea'
import { useContractStore } from 'store/contractStore'
import getAllCategories from 'actions/web3/getAllCategories'
import { XIcon } from '@heroicons/react/solid'
import { syncPosts } from 'actions/web2/posts/syncPosts'
import mintPost from 'actions/web3/mintPost'

const CustomSlider = Slider.createSliderWithTooltip(Slider)

const sliderMarks = {
  0: 'Disagree',
  100: 'Agree',
}

export default function RateModal({
  close,
  ideaToken,
  urlMetaData,
}: {
  close: () => void
  ideaToken: any
  urlMetaData: any
}) {
  const txManager = useTransactionManager()
  const { setIsTxPending } = useContext(GlobalContext)

  // local state for tabs. Create new post (true) or cite existing (false)
  const [isCreateNewPost, setIsCreateNewPost] = useState(true)

  const [inputRating, setInputRating] = useState(50)
  const [inputText, setInputText] = useState('')

  const [citations, setCitations] = useState([])
  const [inFavorArray, setInFavorArray] = useState([])
  const [selectedPosts, setSelectedPosts] = useState([])

  const onCitationRemoved = (post: IdeamarketPost) => {
    const indexOfAlreadyCited = citations.indexOf(post.tokenID)
    const citationsWithOldCitationRemoved = citations.filter(
      (c) => c !== post.tokenID
    )
    const inFavorArrayWithOldRemoved = inFavorArray.filter(
      (ele, ind) => ind !== indexOfAlreadyCited
    )
    const selectedPostsWithOldRemoved = selectedPosts.filter(
      (ele, ind) => ind !== indexOfAlreadyCited
    )

    const newCitations = [...citationsWithOldCitationRemoved]
    const newInFavorArray = [...inFavorArrayWithOldRemoved]
    const newSelectedPosts = [...selectedPostsWithOldRemoved]

    setCitations(newCitations)
    setInFavorArray(newInFavorArray)
    setSelectedPosts(newSelectedPosts)
  }

  function onTradeComplete(
    isSuccess: boolean,
    listingId: string,
    idtValue: string,
    transactionType: TX_TYPES
  ) {
    close()
    ModalService.open(TradeCompleteModal, {
      isSuccess,
      listingId,
      idtValue,
      transactionType,
    })
  }

  const onPostClicked = async () => {
    setIsTxPending(true)
    // TODO: do imageLink
    // TODO: figure out urlContent
    // content, imageHashes, categoryTags, imageLink, isURL, urlContent
    const mintingArgs = [inputText, [], selectedCategories, '', false, '']

    try {
      await txManager.executeTxWithCallbacks(
        'New Post',
        mintPost,
        {
          onReceipt: async (receipt: any) => {
            await syncPosts(receipt?.events?.Transfer?.returnValues?.tokenId)
            setCitations([receipt?.events?.Transfer?.returnValues?.tokenId])
            const newPostCitations = [
              receipt?.events?.Transfer?.returnValues?.tokenId,
            ]
            const newPostInFavor = [inputRating > 50]
            setIsTxPending(false)
            await onRateClicked(newPostCitations, newPostInFavor)
          },
        },
        ...mintingArgs
      )
    } catch (ex) {
      console.log(ex)
      onTradeComplete(false, 'error', 'error', TX_TYPES.NONE)
      setIsTxPending(false)
      setSelectedCategories([])
      return
    }

    // onTradeComplete(true, 'success', 'success', TX_TYPES.RATE)
    setSelectedCategories([])
  }

  // If creating new post, need to pass citations and inFavor in since setting local state is not sync
  const onRateClicked = async (
    newPostCitations?: number[],
    newPostInFavor?: boolean[]
  ) => {
    setIsTxPending(true)

    try {
      const web3TxMethod = ratePost

      const ratingArgs = [
        // tokenId , rating, citations, inFavorArray
        ideaToken?.tokenID,
        inputRating,
        newPostCitations ? newPostCitations : citations,
        newPostInFavor ? newPostInFavor : inFavorArray,
      ]

      await txManager.executeTxWithCallbacks(
        'Rate',
        web3TxMethod,
        {
          onReceipt: async (receipt: any) => {
            await syncNFTOpinions(ideaToken?.tokenID)
            setIsTxPending(false)
          },
        },
        ...ratingArgs
      )
    } catch (ex) {
      console.log(ex)
      setIsTxPending(false)
      onTradeComplete(
        false,
        ideaToken?.listingId,
        ideaToken?.name,
        TX_TYPES.NONE
      )
      return
    }

    onTradeComplete(true, ideaToken?.listingId, ideaToken?.name, TX_TYPES.RATE)
  }

  const isCreatingNewPost = isCreateNewPost && inputText?.length > 0
  const isRatingDisabled = inputRating === 50

  const isTextPostTooLong = inputText?.length > 360

  const { minterAddress } = (ideaToken || {}) as any

  const { data: userDataForMinter } = useQuery<any>(
    [`minterAddress-${minterAddress}`],
    () =>
      getAccount({
        username: null,
        walletAddress: minterAddress,
      })
  )

  const ideamarketPosts = useContractStore.getState().ideamarketPosts

  const [selectedCategories, setSelectedCategories] = useState([])

  const { data: categoriesData } = useQuery(
    ['all-categories', Boolean(ideamarketPosts)],
    () => getAllCategories()
  )

  /**
   * This method is called when a category is clicked.
   * @param newClickedCategory -- Category just clicked
   */
  const onSelectCategory = (newClickedCategory: string) => {
    const isCatAlreadySelected = selectedCategories.includes(newClickedCategory)
    let newCategories = [...selectedCategories]
    if (isCatAlreadySelected) {
      newCategories = newCategories.filter((cat) => cat !== newClickedCategory)
    } else {
      newCategories.push(newClickedCategory)
    }
    setSelectedCategories(newCategories)
  }

  const getRateButtonText = () => {
    if (
      (isCreateNewPost && inputText?.length <= 0) ||
      (!isCreateNewPost && citations?.length <= 0)
    ) {
      return 'Rate without Citation'
    } else if (isCreateNewPost && inputText?.length > 0) {
      return 'Create New Post + Rate with Citation (2 transactions)'
    } else if (!isCreateNewPost) {
      return `Rate with ${citations?.length} citations`
    }
  }

  const displayUsernameOrWallet = convertAccountName(
    userDataForMinter?.username || minterAddress
  )
  const usernameOrWallet = userDataForMinter?.username || minterAddress

  const citationsInFavor = selectedPosts?.filter(
    (p, pInd) => inFavorArray[pInd]
  )
  const citationsNotInFavor = selectedPosts?.filter(
    (p, pInd) => !inFavorArray[pInd]
  )

  return (
    <Modal close={close}>
      <div className="w-full md:w-136 mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <div className="px-6 py-4 bg-black/[.05] text-base font-medium leading-5 truncate">
          {/* Display minter image, username/wallet */}
          {minterAddress && (
            <div className="flex items-center pb-2 whitespace-nowrap">
              <div className="relative rounded-full w-6 h-6">
                <Image
                  className="rounded-full"
                  src={
                    userDataForMinter?.profilePhoto ||
                    '/DefaultProfilePicture.png'
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
              {userDataForMinter?.twitterUsername && (
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
                    @{userDataForMinter?.twitterUsername}
                  </span>
                </A>
              )}
            </div>
          )}

          <ListingContent
            ideaToken={ideaToken}
            page="RateModal"
            urlMetaData={urlMetaData}
            useMetaData={
              getListingTypeFromIDTURL(ideaToken?.url) !== LISTING_TYPE.TWEET &&
              getListingTypeFromIDTURL(ideaToken?.url) !==
                LISTING_TYPE.TEXT_POST
            }
          />
        </div>

        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-lg">Rating</span>
            {/* <div>
              <span className="text-blue-600 font-bold mr-1">
                {formatNumber(avgRating)}
              </span>
            </div> */}
          </div>

          <div className="px-4 py-2 border rounded-lg">
            <div className="flex justify-end items-center mb-12">
              <span className="text-xl font-bold">{inputRating}</span>
            </div>

            <div className="w-[90%] mx-auto">
              <CustomSlider
                className="mb-7"
                defaultValue={50}
                onChange={(value) => {
                  setInputRating(value)
                }}
                marks={sliderMarks}
                step={1}
                min={0}
                max={100}
                tipFormatter={(value) => {
                  return `${value}`
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 my-4">
            <span
              onClick={() => {
                setInputText('')
                setIsCreateNewPost(true)
              }}
              className={classNames(
                isCreateNewPost ? 'text-black' : 'text-black/[.25]',
                'font-bold text-lg cursor-pointer'
              )}
            >
              Create New Post
            </span>
            <span
              onClick={() => {
                setInputText('')
                setIsCreateNewPost(false)
              }}
              className={classNames(
                !isCreateNewPost ? 'text-black' : 'text-black/[.25]',
                'font-bold text-lg cursor-pointer'
              )}
            >
              Cite Existing Posts
            </span>
          </div>

          {isCreateNewPost ? (
            <>
              <div className="flex justify-end">
                <span
                  className={classNames(isTextPostTooLong && 'text-red-500')}
                >
                  {inputText?.length}
                </span>
                /360
              </div>

              <IMTextArea
                onChange={(newTextInput) => setInputText(newTextInput)}
                placeholder="Cite your reasons... (optional)"
              />

              {inputText?.length > 0 &&
                categoriesData &&
                categoriesData?.length > 0 && (
                  <div className="my-4 text-sm">
                    <div className="text-black/[.5] font-semibold">
                      CATEGORY TAGS
                    </div>
                    <div className="flex flex-wrap">
                      {categoriesData.map((category) => {
                        return (
                          <div
                            onClick={() => onSelectCategory(category)}
                            className={classNames(
                              selectedCategories.includes(category)
                                ? 'text-blue-500 bg-blue-100'
                                : 'text-black',
                              'flex items-center border rounded-2xl px-2 py-1 cursor-pointer mr-2 mt-2'
                            )}
                            key={category}
                          >
                            <span>{category}</span>
                            {selectedCategories.includes(category) && (
                              <XIcon className="w-5 h-5 ml-1" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              {citations?.length > 0 ? (
                <>
                  <div
                    onClick={() =>
                      ModalService.open(AddCitationModal, {
                        citations,
                        inFavorArray,
                        selectedPosts,
                        setCitations,
                        setInFavorArray,
                        setSelectedPosts,
                      })
                    }
                    className="w-full h-[5rem] mb-4 bg-brand-gray hover:bg-black/[.1] rounded-lg flex justify-center items-center cursor-pointer"
                  >
                    <PlusCircleIcon className="text-black/[.4] w-6 h-6" />
                  </div>

                  {/* Selected posts / citations */}
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Citations</span>
                    <span className=" text-sm">
                      Selected{' '}
                      <span className="font-semibold">{citations?.length}</span>{' '}
                      <span className="text-black/[.3]">(Maximum 10)</span>
                    </span>
                  </div>

                  <div className="mt-4 text-[#0cae74] text-sm font-bold">
                    FOR ({inFavorArray.filter((ele) => ele).length})
                  </div>

                  {citationsInFavor &&
                    citationsInFavor?.length > 0 &&
                    citationsInFavor.map((post, postInd) => {
                      return (
                        <div
                          className="flex justify-between items-center w-full mt-4"
                          key={postInd}
                        >
                          <div className="w-[85%] bg-[#0cae74]/[.25] rounded-lg p-4">
                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    post?.minterToken?.profilePhoto ||
                                    '/DefaultProfilePicture.png'
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
                            </div>

                            <div>{post.content}</div>
                          </div>

                          <div className="flex justify-end">
                            <XCircleIcon
                              onClick={() => onCitationRemoved(post)}
                              className="w-8 cursor-pointer text-black/[.3] hover:text-red-600"
                            />
                          </div>
                        </div>
                      )
                    })}

                  <div className="mt-4 text-[#e63b3b] text-sm font-bold">
                    AGAINST ({inFavorArray.filter((ele) => !ele).length})
                  </div>

                  {citationsNotInFavor &&
                    citationsNotInFavor?.length > 0 &&
                    citationsNotInFavor.map((post, postInd) => {
                      return (
                        <div
                          className="flex justify-between items-center w-full mt-4"
                          key={postInd}
                        >
                          <div className="w-[85%] bg-[#ec4a4a]/[.25] rounded-lg p-4">
                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    post?.minterToken?.profilePhoto ||
                                    '/DefaultProfilePicture.png'
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
                            </div>

                            <div>{post.content}</div>
                          </div>

                          <div className="flex justify-end">
                            <XCircleIcon
                              onClick={() => onCitationRemoved(post)}
                              className="w-8 cursor-pointer text-black/[.3] hover:text-red-600"
                            />
                          </div>
                        </div>
                      )
                    })}
                </>
              ) : (
                <div
                  onClick={() =>
                    ModalService.open(AddCitationModal, {
                      citations,
                      inFavorArray,
                      selectedPosts,
                      setCitations,
                      setInFavorArray,
                      setSelectedPosts,
                    })
                  }
                  className="w-full h-[5rem] bg-brand-gray hover:bg-black/[.1] rounded-lg flex justify-center items-center cursor-pointer"
                >
                  <PlusCircleIcon className="text-black/[.4] w-6 h-6" />
                </div>
              )}

              {/* <button
                onClick={() =>
                  ModalService.open(AddCitationModal, {
                    citations,
                    inFavorArray,
                    selectedPosts,
                    setCitations,
                    setInFavorArray,
                    setSelectedPosts,
                  })
                }
                className="py-4 mt-4 text-lg font-bold rounded-2xl w-full bg-blue-600 hover:bg-blue-800 text-white"
              >
                <span>Add Citation</span>
              </button> */}
            </>
          )}

          <button
            className={classNames(
              'py-4 mt-4 mb-2 text-lg font-bold rounded-2xl w-full',
              isRatingDisabled
                ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default border-brand-gray'
                : 'border-brand-blue text-white bg-black font-medium hover:bg-black/[.8]'
            )}
            disabled={isRatingDisabled}
            onClick={async () => {
              if (isCreatingNewPost) {
                await onPostClicked()
              } else {
                await onRateClicked()
              }
            }}
          >
            <span>Rate</span>
            <div className="text-sm font-normal opacity-50">
              {getRateButtonText()}
            </div>
          </button>

          <div className="text-xs text-center font-semibold">
            Confirm transaction in wallet to complete.
          </div>

          <TxPending txManager={txManager} />
        </div>
      </div>
    </Modal>
  )
}
