export default function UserRecommendedRowSkeleton() {
  return (
    <div className="flex text-black h-28">
      <div className="flex w-[45%] lg:w-[55%] my-4">
        <div className="bg-gray-400 w-full h-full rounded-lg animate animate-pulse"></div>
      </div>

      <div className="flex items-center w-[55%] lg:w-[45%]">
        {/* % MATCH */}
        <div className="w-[13.75%] lg:w-[11.25%] relative pl-6 pr-10 grow flex items-start">
          <div className="bg-gray-400 w-20 h-20 rounded-lg animate animate-pulse"></div>
        </div>

        {/* POSTS IN COMMON */}
        <div className="w-[13.75%] lg:w-[11.25%] grow flex items-start">
          <div className="bg-gray-400 w-20 h-20 rounded-lg animate animate-pulse"></div>
        </div>

        {/* STAKED */}
        <div className="w-[13.75%] lg:w-[11.25%] grow flex items-start">
          <div className="bg-gray-400 w-20 h-20 rounded-lg animate animate-pulse"></div>
        </div>

        {/* Stake Button */}
        <div className="w-[13.75%] lg:w-[11.25%] grow flex items-start">
          <div className="bg-gray-400 w-20 h-20 rounded-lg animate animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
