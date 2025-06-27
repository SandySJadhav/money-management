import { IconButton } from "@contentful/f36-components"
import { CloseIcon } from "@contentful/f36-icons"

export default function Modal({ children, modalOpen = false, onModalClose = () => { } }) {
  if (!modalOpen) {
    return
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black opacity-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8 md:p-10 pt-3">
          <IconButton
            aria-label="Close"
            variant="transparent"
            size="small"
            onClick={onModalClose}
            className="rounded-full border-none absolute top-4 right-4"
            icon={<CloseIcon variant="negative" />}
          />
          <div className="space-b-4">
            <div className="text-gray-500 dark:text-gray-400">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}