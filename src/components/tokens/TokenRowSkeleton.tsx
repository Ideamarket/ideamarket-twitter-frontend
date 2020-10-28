export default function TokenRowSkeleton() {
  return (
    <>
      <tr className="grid grid-cols-3 md:table-row animate animate-pulse">
        <td className="col-span-3 px-6 py-4 whitespace-no-wrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-7.5 h-7.5 rounded-full bg-gray-400"></div>
            <div className="w-24 h-4 ml-4 bg-gray-400 rounded"></div>
            <div className="flex items-center justify-center ml-auto md:hidden">
              <div className="w-7.5 h-4 bg-gray-400 rounded"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="w-10 h-4 bg-gray-400 rounded md:hidden"></p>
          <p className="h-4 mt-1 bg-gray-400 rounded"></p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="w-10 h-4 bg-gray-400 rounded md:hidden"></p>
          <p className="h-4 mt-1 bg-gray-400 rounded"></p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="w-10 h-4 bg-gray-400 rounded md:hidden"></p>
          <p className="h-4 mt-1 bg-gray-400 rounded"></p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="w-10 h-4 bg-gray-400 rounded md:hidden"></p>
          <p className="h-4 mt-1 bg-gray-400 rounded"></p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="w-10 h-4 bg-gray-400 rounded md:hidden"></p>
          <p className="h-4 mt-1 bg-gray-400 rounded"></p>
        </td>

        <td className="col-span-3 row-span-1 row-start-4 px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap col-start-0">
          <p className="h-4 mt-1 bg-gray-400 rounded"></p>
        </td>
        <td className="hidden px-6 py-4 whitespace-no-wrap md:table-cell">
          <button className="w-32 h-4 bg-gray-400 rounded-lg"></button>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <div className="w-5 h-5 bg-gray-400 rounded"></div>
        </td>
      </tr>
    </>
  )
}