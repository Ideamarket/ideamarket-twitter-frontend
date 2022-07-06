import { UsersIcon } from '@heroicons/react/outline'
import A from 'components/A'
import { convertAccountName } from 'lib/utils/stringUtil'

type Props = {
  holders: any[]
  userData: any
}

const HoldersSummary = ({ holders, userData }: Props) => {
  const isMoreThan3Holders = holders && holders.length > 3

  return (
    <>
      {holders && holders.length > 0 && (
        <div className="flex items-center space-x-1 flex-wrap text-sm ">
          <UsersIcon className="w-3 h-3" />
          <span className="opacity-70">Held by</span>
          <A
            href={`/u/${holders[0].username || holders[0].walletAddress}`}
            className="hover:underline opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >{`${convertAccountName(
            holders[0].username || holders[0].walletAddress
          )}${holders.length >= 2 ? ',' : ''}`}</A>
          {holders.length >= 2 && (
            <A
              href={`/u/${holders[1].username || holders[1].walletAddress}`}
              className="hover:underline opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >{`${convertAccountName(
              holders[1].username || holders[1].walletAddress
            )}${holders.length >= 3 ? ',' : ''}`}</A>
          )}
          {holders.length >= 3 && (
            <A
              href={`/u/${holders[2].username || holders[2].walletAddress}`}
              className="hover:underline opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >{`${convertAccountName(
              holders[2].username || holders[2].walletAddress
            )}`}</A>
          )}
          {isMoreThan3Holders && (
            <A className="opacity-90 cursor-pointer">{`and ${
              userData?.holders - 3
            } others...`}</A>
          )}
        </div>
      )}
    </>
  )
}

export default HoldersSummary
