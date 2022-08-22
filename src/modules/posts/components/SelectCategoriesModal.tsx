import { XIcon } from '@heroicons/react/solid'
import { getCategories } from 'actions/web2/getCategories'
import classNames from 'classnames'
import { Modal } from 'components'
import { useState } from 'react'
import { useQuery } from 'react-query'

type SelectCategoriesModalProps = {
  close: () => void
  selectedCategories: any[]
  setSelectedCategories: (selectedCategories: any[]) => void
}

export default function SelectCategoriesModal({
  close,
  selectedCategories,
  setSelectedCategories,
}: SelectCategoriesModalProps) {
  const [categorySearchText, setCategorySearchText] = useState('')

  const [localSelectedCategories, setLocalSelectedCategories] =
    useState(selectedCategories)

  const { data: categoriesData } = useQuery(['all-categories'], () =>
    getCategories({ enabled: true })
  )

  const onFilterClicked = () => {
    setSelectedCategories(localSelectedCategories)
    close()
  }

  /**
   * This method is called when a category is clicked.
   * @param newClickedCategory -- Category just clicked
   */
  const onLocalCategoryChanged = (newClickedCategory: string) => {
    const isCatAlreadySelected =
      localSelectedCategories.includes(newClickedCategory)
    let newLocalSelectedCategories = [...localSelectedCategories]
    if (isCatAlreadySelected) {
      newLocalSelectedCategories = newLocalSelectedCategories.filter(
        (cat) => cat !== newClickedCategory
      )
    } else {
      newLocalSelectedCategories.push(newClickedCategory)
    }
    setLocalSelectedCategories(newLocalSelectedCategories)
  }

  const displayedCats =
    categorySearchText.length > 0
      ? categoriesData.filter((cat) =>
          cat?.name.toLowerCase().includes(categorySearchText.toLowerCase())
        )
      : categoriesData

  return (
    <Modal close={close}>
      <div className="w-full md:w-136 mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <div className="px-6 py-4 bg-black/[.05]">
          <input
            onChange={(event) => setCategorySearchText(event.target.value)}
            placeholder="Search categories..."
            className="bg-transparent focus:outline-none px-2 py-1"
          />
        </div>

        <div className="px-6 py-4">
          {displayedCats && displayedCats?.length > 0 && (
            <div className="my-4 text-sm">
              <div className="text-black/[.5] font-semibold">
                All Categories
              </div>
              <div className="flex flex-wrap">
                {displayedCats.map((category) => {
                  return (
                    <div
                      onClick={() => onLocalCategoryChanged(category?.name)}
                      className={classNames(
                        localSelectedCategories.includes(category?.name)
                          ? 'text-blue-500 bg-blue-100'
                          : 'text-black',
                        'flex items-center border rounded-2xl px-2 py-1 cursor-pointer mr-2 mt-2'
                      )}
                      key={category?.name}
                    >
                      <span>{category?.name}</span>
                      {localSelectedCategories.includes(category?.name) && (
                        <XIcon className="w-5 h-5 ml-1" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex justify-between items-center space-x-4">
          <button
            onClick={close}
            className="bg-white w-full py-2 font-bold text-lg rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={onFilterClicked}
            className="bg-blue-600 w-full py-2 font-bold text-lg text-white rounded-lg border"
          >
            Filter
          </button>
        </div>
      </div>
    </Modal>
  )
}
