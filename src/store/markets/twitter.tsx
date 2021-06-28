import { IMarketSpecifics } from '.'
import TwitterWhite from '../../assets/twitter-white.svg'
import TwitterBlack from '../../assets/twitter-black.svg'
import TwitterOutline from '../../assets/twitter-outline.svg'
import TwitterBlackSolid from '../../assets/twitter-solid-black.svg'
import { queryLambdavatar } from 'actions'
import { useTheme } from 'next-themes'

function ThemeValue() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme
}

export default class TwitterMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Twitter'
  }

  isEnabled(): boolean {
    return true
  }

  getMarketNameURLRepresentation(): string {
    return 'twitter'
  }

  getMarketSVGBlack(): JSX.Element {
    return <TwitterBlack />
  }

  getMarketSVGBlackSolid(): JSX.Element {
    if (ThemeValue() === 'dark') {
      return <TwitterWhite />
    } else if (ThemeValue() === 'light') {
      return <TwitterBlackSolid />
    } else {
      return null
    }
  }

  getMarketSVGWhite(): JSX.Element {
    return <TwitterWhite />
  }

  getMarketOutlineSVG(): JSX.Element {
    return <TwitterOutline />
  }

  getMarketSVGTheme(): JSX.Element {
    if (ThemeValue() === 'dark') {
      return <TwitterWhite />
    } else if (ThemeValue() === 'light') {
      return <TwitterOutline className="w-5 h-5" />
    } else {
      return null
    }
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    return `https://twitter.com/${tokenName.slice(1)}`
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

  isVerificationEnabled(): boolean {
    return true
  }

  getVerificationExplanation(): string {
    return 'To verify, you will be asked to post a Tweet from this Twitter account containing a verification code.'
  }

  getVerificationSHAPrompt(sha: string): string {
    return `Verifying myself on ideamarket.io: ${sha}`
  }

  getVerificationSHAPromptExplanation(): string {
    return 'Please post a Tweet containing the content in the box below. After you have posted the Tweet, click Next. (Note: This must be a new Tweet — a reply to another Tweet will not work properly.)'
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `I have posted the Tweet.`
  }
}
