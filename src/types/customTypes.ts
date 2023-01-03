export interface VisibilityOptions {
  email?: boolean
  bio?: boolean
  ethAddress?: boolean
}

export type SignedAddress = {
  message: string
  signature: string
}

export type TwitterUserProfile = {
  id?: string
  twitterUserId?: string
  twitterUsername?: string

  name?: string
  username?: string
  bio?: string
  twitterProfilePicURL?: string
  email?: string
  walletAddress?: string
  visibilityOptions?: VisibilityOptions
}

export type UserPublicProfile = Partial<{ twitterProfilePicURL: string }>
