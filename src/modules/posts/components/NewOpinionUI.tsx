import Slider, { Handle } from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useContext, useState } from 'react'
import classNames from 'classnames'
import { GlobalContext } from 'lib/GlobalContext'
import { verifyTokenName } from 'actions'
import IMTextArea from 'modules/forms/components/IMTextArea'
import ListingContent from 'components/tokens/ListingContent'
import {
  createNewPost,
  IdeamarketTwitterPost,
} from '../services/TwitterPostService'
import { TX_TYPES } from './PostAndRateCompleteModal'
import { getValidURL } from 'actions/web2/getValidURL'
import ModalService from 'components/modals/ModalService'
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import AddTwitterCitationModal from './AddTwitterCitationModal'
import { createNewOpinion } from 'modules/ratings/services/TwitterOpinionService'

type NewOpinionUIProps = {
  defaultRating?: number
  defaultRatedPost?: IdeamarketTwitterPost
  isTxButtonActive?: boolean
  onPostOrRateComplete: (isSuccess: boolean, txType: TX_TYPES) => void
}

export default function NewOpinionUI({
  defaultRating = 50,
  defaultRatedPost,
  isTxButtonActive = true,
  onPostOrRateComplete,
}: NewOpinionUIProps) {
  const { setIsTxPending, jwtToken } = useContext(GlobalContext)

  const [finalURL, setFinalURL] = useState(
    defaultRatedPost ? defaultRatedPost.content : ''
  )
  const [isValidURL, setIsValidURL] = useState(defaultRatedPost ? true : false)
  const [isAlreadyPosted, setIsAlreadyPosted] = useState(
    defaultRatedPost ? true : false
  )
  const [ratedPost, setRatedPost] = useState(
    defaultRatedPost ? defaultRatedPost : null
  ) // Post user is rating

  const [inputRating, setInputRating] = useState(defaultRating)

  const [citations, setCitations] = useState([]) // Array of postIDs
  const [inFavorArray, setInFavorArray] = useState([]) // Array of bools, corresponding to postIDs in citations based on index in array
  const [selectedPosts, setSelectedPosts] = useState([]) // Actual posts containing all post data

  const onCitationRemoved = (post: any) => {
    const indexOfAlreadyCited = citations.indexOf(post.postID)
    const citationsWithOldCitationRemoved = citations.filter(
      (c) => c !== post.postID
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

  // const [selectedCategories, setSelectedCategories] = useState([])

  // const { data: categoriesData } = useQuery(
  //   ['all-categories', Boolean(ideamarketPosts)],
  //   () => getCategories({ enabled: true })
  // )

  /**
   * This method is called when a category is clicked.
   * @param newClickedCategory -- Category just clicked
   */
  // const onSelectCategory = (newClickedCategory: string) => {
  //   const isCatAlreadySelected = selectedCategories.includes(newClickedCategory)
  //   let newCategories = [...selectedCategories]
  //   if (isCatAlreadySelected) {
  //     newCategories = newCategories.filter((cat) => cat !== newClickedCategory)
  //   } else {
  //     newCategories.push(newClickedCategory)
  //   }
  //   setSelectedCategories(newCategories)
  // }

  const onURLTyped = async (newTextInput: string) => {
    const typedURL = newTextInput

    // setSelectedCategories([]) // Set selected categories to none if any input typed

    const canonical = await getValidURL(typedURL)

    const { isValid, isAlreadyPosted, existingPost } = await verifyTokenName(
      canonical
    )

    setFinalURL(canonical)

    setIsValidURL(isValid)
    setIsAlreadyPosted(isAlreadyPosted)
    setRatedPost(existingPost)
  }

  const onRateClicked = async () => {
    setIsTxPending(true)

    // if post does not already exist, then create it
    let localRatedPost = null
    if (isAlreadyPosted) {
      localRatedPost = ratedPost
    } else {
      const newPost = await createNewPost({ jwt: jwtToken, content: finalURL })
      localRatedPost = newPost
    }

    // if there are citations, combine them with inFavor
    const citationsWithFavor =
      citations && citations?.length > 0
        ? [{ postID: citations[0], inFavor: inFavorArray[0] }]
        : null

    const newOpinion = await createNewOpinion({
      jwt: jwtToken,
      ratedPostID: localRatedPost.postID,
      rating: inputRating,
      citations: citationsWithFavor,
    })

    setIsTxPending(false)

    onPostOrRateComplete(Boolean(newOpinion), TX_TYPES.URL_POST)
  }

  const isRatingDisabled = !isValidURL || inputRating === 50

  const citationsInFavor = selectedPosts?.filter(
    (p, pInd) => inFavorArray[pInd]
  )
  const citationsNotInFavor = selectedPosts?.filter(
    (p, pInd) => !inFavorArray[pInd]
  )

  return (
    <div className="w-full">
      {/* Tab buttons and text area */}
      <div className="px-6 py-4">
        {/* Tab buttons */}

        <div className="my-4">
          <div className="ml-1 mb-3 text-sm font-semibold">TWEET PREVIEW</div>

          {!defaultRatedPost ? (
            <div className="bg-black/[.1] rounded-lg p-4">
              {isValidURL && (
                <ListingContent
                  imPost={{ content: finalURL }}
                  page="NewOpinionModal"
                  urlMetaData={null}
                  key={finalURL}
                />
              )}
              {!isValidURL && !isAlreadyPosted && (
                <div className="text-red-400">
                  {finalURL === ''
                    ? 'Enter a tweet URL to rate'
                    : 'INVALID URL'}
                </div>
              )}
              {isAlreadyPosted && (
                <div className="text-red-400">
                  THIS TWEET IS ALREADY ON IDEAMARKET
                </div>
              )}

              <IMTextArea
                onChange={(newTextInput: string) => {
                  onURLTyped(newTextInput)
                }}
                placeholder={'Paste URL here...'}
                defaultRows={1}
              />
            </div>
          ) : (
            <div className="bg-black/[.1] rounded-lg p-4">
              <ListingContent
                imPost={{ content: defaultRatedPost.content }}
                page="NewOpinionModal"
                urlMetaData={null}
              />
            </div>
          )}
        </div>

        <div className="py-2">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Rate</span>
            <span className="text-xl font-bold">{inputRating}</span>
          </div>

          <div className="w-[100%] mx-auto">
            <div className="w-full relative flex items-center h-16 bg-white rounded-2xl border">
              <div className="absolute top-1 left-2 text-xs opacity-50">
                Disagree
              </div>
              <Slider
                className=""
                defaultValue={defaultRating}
                onChange={(value) => {
                  setInputRating(value)
                }}
                // onAfterChange={(value) => {
                //   if (!isFullyFunctional) {
                //     onRateDragged(imPost)
                //     return
                //   }
                // }}
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
              <div className="absolute top-1 right-2 text-xs opacity-50">
                Agree
              </div>
            </div>
          </div>
        </div>

        <>
          {citations?.length > 0 ? (
            <>
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
                        <ListingContent
                          imPost={{ content: post.content }}
                          page="NewOpinionModal"
                          urlMetaData={null}
                        />
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
                        <ListingContent
                          imPost={{ content: post.content }}
                          page="NewOpinionModal"
                          urlMetaData={null}
                        />
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
            <>
              <div className="ml-1 mb-3 text-sm font-semibold">
                ADD CITATIONS
              </div>
              <div
                onClick={() =>
                  ModalService.open(AddTwitterCitationModal, {
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
            </>
          )}
        </>

        {/* {categoriesData && categoriesData?.length > 0 && (
          <div className="my-4 text-sm">
            <div className="text-black/[.5] font-semibold">CATEGORY TAGS</div>
            <div className="flex flex-wrap">
              {categoriesData.map((category) => {
                return (
                  <div
                    onClick={() => onSelectCategory(category?.name)}
                    className={classNames(
                      selectedCategories.includes(category?.name)
                        ? 'text-blue-500 bg-blue-100'
                        : 'text-black',
                      'flex items-center border rounded-2xl px-2 py-1 cursor-pointer mr-2 mt-2'
                    )}
                    key={category?.name}
                  >
                    <span>{category?.name}</span>
                    {selectedCategories.includes(category?.name) && (
                      <XIcon className="w-5 h-5 ml-1" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )} */}

        {isTxButtonActive && (
          <>
            <button
              className={classNames(
                'py-4 mt-4 mb-2 text-lg font-bold rounded-2xl w-full font-sf-compact-medium',
                isRatingDisabled
                  ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default border-brand-gray'
                  : 'border-brand-blue text-white bg-brand-blue font-medium  hover:bg-blue-800'
              )}
              disabled={isRatingDisabled}
              onClick={onRateClicked}
            >
              Rate
            </button>
          </>
        )}
      </div>
    </div>
  )
}
