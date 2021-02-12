export default function LockedTokenRowSkeleton() {
  return (
    <div className="table-row cursor-pointer bg-brand-gray animate animate-pulse">
      <div className="px-6 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-auto bg-white rounded">
            <div className="invisible">123</div>
          </div>
        </div>
      </div>
      <div className="px-6 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="invisible w-10 h-auto bg-white rounded">
            <div className="invisible">123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
