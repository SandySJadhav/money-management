import { XIcon } from "@/lib/icons"

export default function Modal({ modalOpen = false, onModalClose = () => { } }) {

  if (!modalOpen) {
    return
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black opacity-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8 md:p-10">
          <button
            aria-label="Close"
            onClick={onModalClose}
            className="absolute top-4 right-4 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Add Expenses</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Unlock the power of your wealth.
            </p>
            <div className="grid gap-4">

            </div>
          </div>
        </div>
      </div>
    </>
  )
}