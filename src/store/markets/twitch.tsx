import { IMarketSpecifics } from '.'
import TwitchWhite from '../../assets/twitch-white.svg'
import { queryLambdavatar } from 'actions'
import { useTheme } from 'next-themes'

function ThemeValue() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme
}

export default class TwitchMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Twitch'
  }

  isEnabled(): boolean {
    return true
  }

  getMarketNameURLRepresentation(): string {
    return 'twitch'
  }

  getMarketSVGBlack(): JSX.Element {
    return <TwitchWhite />
  }

  getMarketSVGBlackSolid(): JSX.Element {
    return <TwitchDark />
  }

  getMarketSVGWhite(): JSX.Element {
    return <TwitchWhite />
  }

  getMarketOutlineSVG(): JSX.Element {
    return <TwitchWhite />
  }

  getMarketSVGTheme(): JSX.Element {
    return <TwitchWhite />
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    return `https://twitch.tv/${tokenName}`
  }

  getTokenIconURL(tokenName: string): Promise<string> {
    return queryLambdavatar({
      rawMarketName: this.getMarketNameURLRepresentation(),
      rawTokenName: this.getTokenNameURLRepresentation(tokenName),
    })
  }

  normalizeUserInputTokenName(userInput: string): string {
    return userInput.toLowerCase()
  }

  convertUserInputToTokenName(userInput: string): string {
    return `${userInput}`
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    return tokenName
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    return `${tokenNameInURLRepresentation}`
  }

  // List Token

  getListTokenPrefix(): string {
    return 'twitch.tv/'
  }

  getListTokenSuffix(): string {
    return ''
  }

  // Verification

  isVerificationEnabled(): boolean {
    return true
  }

  getVerificationExplanation(): string {
    return `To verify, you will be asked to add a verification code to your account's bio. After verification is complete you can remove it.`
  }

  getVerificationSHAPrompt(sha: string): string {
    return `Verifying myself on ideamarket.io: ${sha}`
  }

  getVerificationSHAPromptExplanation(): string {
    return `This is your verification code. Please edit your account's bio to contain the below content. After you made the edit, click Next.`
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `I have edited the bio.`
  }
}
