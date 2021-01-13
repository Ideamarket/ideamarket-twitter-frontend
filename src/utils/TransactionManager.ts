export default class TransactionManager {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>

  isPending: boolean
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>

  hash: string
  setHash: React.Dispatch<React.SetStateAction<string>>

  constructor([name, setName], [isPending, setIsPending], [hash, setHash]) {
    this.name = name
    this.setName = setName
    this.isPending = isPending
    this.setIsPending = setIsPending
    this.hash = hash
    this.setHash = setHash
  }

  async executeTx(name: string, func: (...args: any[]) => any, ...args: any[]) {
    this.setIsPending(true)
    this.setName(name)

    try {
      await func(...args).on('transactionHash', (hash: string) => {
        this.setHash(hash)
      })
    } catch (ex) {
      throw `Transaction execution failed: ${ex}`
    } finally {
      this.setIsPending(false)
      this.setName('')
      this.setHash('')
    }
  }
}
