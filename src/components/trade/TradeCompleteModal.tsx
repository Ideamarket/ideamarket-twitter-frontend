import { Modal } from 'components'
import A from 'components/A'

export enum TRANSACTION_TYPES {
  NONE,
  BUY,
  SELL,
  LOCK,
  LIST,
}

export default function TradeCompleteModal({
  close,
  isSuccess,
  tokenName,
  transactionType,
}: {
  close: () => void
  isSuccess: boolean
  tokenName: string
  transactionType: TRANSACTION_TYPES
}) {
  let tweetText = ''
  if (transactionType === TRANSACTION_TYPES.LIST) {
    tweetText = `Just listed ${tokenName} on @ideamarket_io`
  } else if (transactionType === TRANSACTION_TYPES.BUY) {
    tweetText = `Just bought ${tokenName} on @ideamarket_io`
  } else if (transactionType === TRANSACTION_TYPES.LOCK) {
    tweetText = `Just locked ${tokenName} for 1 year on @ideamarket_io`
  }

  const tweetTemplate = encodeURIComponent(tweetText)
  const canTweet =
    transactionType === TRANSACTION_TYPES.LIST ||
    transactionType === TRANSACTION_TYPES.BUY ||
    transactionType === TRANSACTION_TYPES.LOCK

  return (
    <Modal close={close}>
      <div className="md:min-w-100 px-2.5 py-5">
        {isSuccess ? (
          <>
            <div className="flex justify-center text-4xl">🎉</div>
            <div className="flex justify-center mt-2 text-3xl text-brand-green">
              Success!
            </div>
            {canTweet && (
              <div className="flex justify-center mt-10">
                <A
                  className="twitter-share-button"
                  href={`https://twitter.com/intent/tweet?text=${tweetTemplate}&url=https://ideamarket.io`}
                >
                  <button className="w-32 h-10 text-base font-medium bg-white dark:text-gray-50 inborder-2 dark:bg-gray-500 rounded-lg border-brand-blue text-brand-blue hover:text-white tracking-tightest-2 font-sf-compact-medium hover:bg-brand-blue">
                    Tweet about it
                  </button>
                </A>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center mt-2 text-3xl text-brand-red dark:text-red-500">
              Something went wrong
            </div>
            <div className="mt-5 text-base break-all text-brand-gray-2 dark:text-gray-300">
              The transaction failed to execute.
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
