import { IMarketSpecifics } from '.'
import YoutubeWhite from '../../assets/youtube.svg'
import YoutubeBlack from '../../assets/youtube-black.svg'

export default class YoutubeMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Youtube'
  }

  getMarketNameURLRepresentation(): string {
    return 'Youtube'
  }

  getMarketSVGBlack(): JSX.Element {
    return <YoutubeBlack />
  }

  getMarketSVGWhite(): JSX.Element {
    return <YoutubeWhite />
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    throw `not implemented`
  }

  getTokenIconURL(tokenName: string): string {
    throw `not implemented`
  }

  normalizeUserInputTokenName(userInput: string): string {
    throw `not implemented`
  }

  convertUserInputToTokenName(userInput: string): string {
    throw `not implemented`
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    throw `not implemented`
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    throw `not implemented`
  }

  // List Token

  getListTokenPrefix(): string {
    throw `not implemented`
  }

  getListTokenSuffix(): string {
    throw `not implemented`
  }

  // Verification

  getVerificationExplanation(): string {
    throw `not implemented`
  }

  getVerificationSHAPrompt(sha: string): string {
    throw `not implemented`
  }

  getVerificationSHAPromptExplanation(): string {
    throw `not implemented`
  }

  getVerificationConfirmCheckboxLabel(): string {
    throw `not implemented`
  }
}
