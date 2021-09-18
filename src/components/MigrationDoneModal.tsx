import { Modal } from 'components'

type Props = {
  close: () => void
}

const MigrationDoneModal = ({ close }: Props) => {
  const closeModal = () => {
    localStorage.setItem('MIGRATION_MODAL_SEEN', 'true')
    close()
  }

  return (
    <Modal close={closeModal}>
      <div className="md:min-w-100 p-4 md:p-20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a
        purus eget lorem tempus euismod non et lacus.
      </div>
    </Modal>
  )
}

export default MigrationDoneModal
