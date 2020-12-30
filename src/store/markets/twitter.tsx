import { IMarketSpecifics } from '.'
import TwitterWhite from '../../assets/twitter-white.svg'
import TwitterBlack from '../../assets/twitter-black.svg'

export default class TwitterMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Twitter'
  }

  getMarketNameURLRepresentation(): string {
    return 'twitter'
  }

  getMarketSVGBlack(): JSX.Element {
    return <TwitterBlack />
  }

  getMarketSVGWhite(): JSX.Element {
    return <TwitterWhite />
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    return `https://twitter.com/${tokenName.slice(1)}`
  }

  getTokenIconURL(tokenName: string): string {
    return `https://unavatar.backend.ideamarket.io:8080/twitter/${tokenName.slice(
      1
    )}`
  }

  normalizeUserInputTokenName(userInput: string): string {
    return userInput.toLowerCase()
  }

  convertUserInputToTokenName(userInput: string): string {
    return `@${userInput}`
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    return tokenName.slice(1)
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    return `@${tokenNameInURLRepresentation}`
  }

  // List Token

  getListTokenPrefix(): string {
    return '@'
  }

  getListTokenSuffix(): string {
    return ''
  }

  // Verification

  getVerificationExplanation(): string {
    return 'Upon initiation of the verification process you will be given a verification code. This code will be used to verify that you have access to the listed account by asking you to post a Tweet containing said code from the corresponding Twitter account.'
  }

  getVerificationSHAPrompt(sha: string): string {
    return `Ideamarket Verification: ${sha}`
  }

  getVerificationSHAPromptExplanation(): string {
    return `This is your verification code. Please post a Tweet with the below content. After you posted the Tweet, click Next.`
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `I have posted the Tweet.`
  }
}
