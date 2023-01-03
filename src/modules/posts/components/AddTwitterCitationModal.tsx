import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from '@heroicons/react/outline'
import { getValidURL } from 'actions/web2/getValidURL'
import classNames from 'classnames'
import { Modal } from 'components'
import ListingContent from 'components/tokens/ListingContent'
import { GlobalContext } from 'lib/GlobalContext'
import IMTextArea from 'modules/forms/components/IMTextArea'
import { useContext, useState } from 'react'
import { IdeamarketPost } from '../services/PostService'
import {
  createNewPost,
  getTwitterPostByURL,
} from '../services/TwitterPostService'

enum IN_FAVOR_STATE {
  NONE,
  FOR,
  AGAINST,
}

type AddCitationModalProps = {
  close: () => void
  citations: number[]
  inFavorArray: boolean[]
  selectedPosts: IdeamarketPost[]
  setCitations: (citations: number[]) => void
  setInFavorArray: (inFavorArray: boolean[]) => void
  setSelectedPosts: (selectedPosts: IdeamarketPost[]) => void
}

export default function AddTwitterCitationModal({
  close,
  citations,
  inFavorArray,
  selectedPosts,
  setCitations,
  setInFavorArray,
  setSelectedPosts,
}: AddCitationModalProps) {
  const { jwtToken } = useContext(GlobalContext)
  const [finalURL, setFinalURL] = useState('')
  const [isValidURL, setIsValidURL] = useState(false)

  const [localInFavorArray, setLocalInFavorArray] = useState(inFavorArray)

  const onAddCitationClicked = async () => {
    // Either create new post or pull existing post to get post data
    const existingPost = await getTwitterPostByURL({ content: finalURL })
    const isAlreadyPosted = Boolean(existingPost)
    let post = null
    if (isAlreadyPosted) {
      post = existingPost
    } else {
      // Create new post for this tweet URL
      const newPost = await createNewPost({ jwt: jwtToken, content: finalURL })
      post = newPost
    }

    const newCitations = [post.postID]
    const newSelectedPosts = [post]

    setCitations(newCitations)
    setInFavorArray(localInFavorArray)
    setSelectedPosts(newSelectedPosts)

    close()
  }

  const onURLTyped = async (newTextInput: string) => {
    const typedURL = newTextInput

    // setSelectedCategories([]) // Set selected categories to none if any input typed

    const canonical = await getValidURL(typedURL)
    console.log('canonical==', canonical)

    // If null, then reset inFavorArray
    if (!Boolean(canonical)) {
      setLocalInFavorArray([])
    }

    setFinalURL(canonical)

    setIsValidURL(Boolean(canonical))
  }

  const onLocalCitationChanged = (inFavorState: IN_FAVOR_STATE) => {
    const isInFavor = inFavorState === IN_FAVOR_STATE.FOR
    const newLocalInFavorArray =
      inFavorState === IN_FAVOR_STATE.NONE ? [] : [isInFavor]

    setLocalInFavorArray(newLocalInFavorArray)
  }

  return (
    <Modal close={close}>
      <div className="w-full md:w-136 mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <div className="px-6 py-4">
          <div className="pb-6">
            <button
              onClick={onAddCitationClicked}
              disabled={localInFavorArray?.length <= 0}
              className={classNames(
                localInFavorArray?.length <= 0
                  ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default'
                  : 'text-white bg-blue-600 hover:bg-blue-800',
                'py-4 mt-4 text-lg font-bold rounded-2xl w-full'
              )}
            >
              Add Citation
            </button>
          </div>

          {/* Against - Selected - For HEADER */}
          <div className="mb-4 flex justify-between items-center font-bold">
            <span className="text-[#e63b3b] text-sm">
              <ArrowCircleLeftIcon className="w-5 cursor-pointer mr-1" />
              <span>AGAINST</span>
              {/* <span className="ml-1">
                ({localInFavorArray.filter((ele) => !ele).length})
              </span> */}
            </span>

            <span className=" text-sm">
              Selected{' '}
              {/* <span className="font-semibold">{localCitations?.length}</span>{' '} */}
              <span className="text-black/[.3]">(Maximum 10)</span>
            </span>

            <span className="text-[#0cae74] text-sm flex items-center">
              {/* <span className="mr-1">
                ({localInFavorArray.filter((ele) => ele).length})
              </span> */}
              <span>FOR</span>
              <ArrowCircleRightIcon className="w-5 cursor-pointer ml-1" />
            </span>
          </div>

          <IMTextArea
            onChange={(newTextInput: string) => {
              onURLTyped(newTextInput)
            }}
            placeholder={'Paste URL here...'}
            defaultRows={1}
          />

          <div className="my-4">
            <div className="ml-1 mb-3 text-sm font-semibold">TWEET PREVIEW</div>

            <div className="flex items-center w-full mb-2">
              {(localInFavorArray?.length === 0 ||
                (localInFavorArray?.length > 0 && localInFavorArray[0])) && (
                <div className="w-[15%]">
                  <ArrowCircleLeftIcon
                    onClick={() =>
                      onLocalCitationChanged(IN_FAVOR_STATE.AGAINST)
                    }
                    className="w-5 cursor-pointer"
                  />
                </div>
              )}

              <div
                className={classNames(
                  localInFavorArray?.length > 0 ? 'w-[85%]' : 'w-[70%]',
                  localInFavorArray?.length > 0
                    ? !localInFavorArray[0]
                      ? 'bg-[#ec4a4a]/[.25]'
                      : 'bg-[#0cae74]/[.25]'
                    : 'bg-black/[.1] ',
                  'rounded-lg p-4'
                )}
              >
                {isValidURL && (
                  <ListingContent
                    imPost={{ content: finalURL }}
                    page="AddTwitterCitationModal"
                    urlMetaData={null}
                    key={finalURL}
                  />
                )}
                {!isValidURL && (
                  <div className="text-red-400">
                    {finalURL === ''
                      ? 'Enter a tweet URL to cite'
                      : 'INVALID URL'}
                  </div>
                )}
              </div>

              {(localInFavorArray?.length === 0 ||
                (localInFavorArray?.length > 0 && !localInFavorArray[0])) && (
                <div className="w-[15%] flex justify-end">
                  <ArrowCircleRightIcon
                    onClick={() => onLocalCitationChanged(IN_FAVOR_STATE.FOR)}
                    className="w-5 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
