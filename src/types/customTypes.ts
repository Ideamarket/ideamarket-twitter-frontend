export interface VisibilityOptions {
  email?: boolean
  bio?: boolean
  ethAddress?: boolean
}

export type SignedAddress = {
  message: string
  signature: string
}

export type UserProfile = {
  name?: string
  username?: string
  bio?: string
  profilePhoto?: string
  email?: string
  walletAddress?: string
  visibilityOptions?: VisibilityOptions
  twitterUsername?: string
}

export type UserPublicProfile = Partial<{ profilePhoto: string }>
