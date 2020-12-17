import { IMarketSpecifics } from '.'
import SubstackWhite from '../../assets/substack-white.svg'
import SubstackBlack from '../../assets/substack-black.svg'

export default class SubstackMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Substack'
  }

  getMarketNameURLRepresentation(): string {
    return 'substack'
  }

  getMarketSVGBlack(): JSX.Element {
    return <SubstackBlack />
  }

  getMarketSVGWhite(): JSX.Element {
    return <SubstackWhite />
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    return `https://${tokenName}.substack.com/`
  }

  getTokenIconURL(tokenName: string): string {
    return `https://unavatar.now.sh/substack/${tokenName}`
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
    return '.substack.com'
  }

  // Verification

  getVerificationExplanation(): string {
    return 'Upon initiation of the verification process you will be given a verification code. This code will be used to verify that you have access to the listed account by asking you to post a Tweet containing said code from the corresponding Twitter account.'
  }

  getVerificationUUIDPrompt(uuid: string): string {
    return `Ideamarket Verification: ${uuid}`
  }

  getVerificationUUIDPromptExplanation(): string {
    return `This is your verification code. Please post a Tweet with the below content. After you posted the Tweet, click Next.`
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `I have posted the Tweet.`
  }
}
