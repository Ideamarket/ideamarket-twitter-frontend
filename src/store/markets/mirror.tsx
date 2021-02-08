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
    return `https://${tokenName}.mirror.xyz`
  }

  getTokenIconURL(tokenName: string): string {
    return `https://unavatar.backend.ideamarket.io:8080/mirror/${tokenName}`
  }

  normalizeUserInputTokenName(userInput: string): string {
    return userInput.toLowerCase()
  }

  convertUserInputToTokenName(userInput: string): string {
    return userInput
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    return tokenName
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    return tokenNameInURLRepresentation
  }

  // List Token

  getListTokenPrefix(): string {
    return ''
  }

  getListTokenSuffix(): string {
    return '.mirror.xyz'
  }

  // Verification

  isVerificationEnabled(): boolean {
    return false
  }

  getVerificationExplanation(): string {
    return `not implemented`
  }

  getVerificationSHAPrompt(sha: string): string {
    return `not implemented`
  }

  getVerificationSHAPromptExplanation(): string {
    return `not implemented`
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `not implemented`
  }
}
