import { IMarketSpecifics } from '.'
import MirrorWhite from '../../assets/mirror-white.svg'
import MirrorBlack from '../../assets/mirror-black.svg'

export default class MirrorMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Mirror'
  }

  getMarketNameURLRepresentation(): string {
    return 'mirror'
  }

  getMarketSVGBlack(): JSX.Element {
    return <MirrorBlack />
  }

  getMarketSVGWhite(): JSX.Element {
    return <MirrorWhite />
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
