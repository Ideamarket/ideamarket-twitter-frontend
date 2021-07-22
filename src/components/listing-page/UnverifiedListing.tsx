import ModalService from 'components/modals/ModalService'
import VerifyModal from 'components/VerifyModal'

export default function UnverifiedListing({
  claimableInterest,
  marketSpecifics,
  market,
  token,
}) {
  return (
    <div className="flex flex-col items-center text-xl">
      <span>Claimable interest</span>
      <span className="font-semibold">${claimableInterest}</span>
      <div className="mt-5 mb-2 text-sm md:mb-5 text-brand-blue dark:text-blue-500">
        {marketSpecifics.isVerificationEnabled() ? (
          <button
            className="flex items-center justify-center h-12 w-64 text-center font-semibold bg-white border-2 dark:bg-gray-500 dark:text-gray-300 rounded-lg hover:bg-brand-blue hover:text-white border-brand-blue text-brand-blue"
            onClick={() => {
              ModalService.open(VerifyModal, { market, token })
            }}
          >
            Verify Ownership
          </button>
        ) : (
          <div>Verification not yet enabled</div>
        )}
      </div>
    </div>
  )
}
