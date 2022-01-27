import { IMarketSpecifics } from '.'
import TwitterOutlineWhite from '../../assets/twitter-outline-white.svg'
import TwitterOutlineBlack from '../../assets/twitter-outline-black.svg'
import { queryLambdavatar } from 'actions'

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
    return <TwitterOutlineBlack />
  }

  getMarketSVGWhite(): JSX.Element {
    return <TwitterOutlineWhite />
  }

  getMarketSVGTheme(theme?): JSX.Element {
    if (theme === 'dark') {
      return <TwitterOutlineWhite />
    } else {
      return <TwitterOutlineBlack />
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

  convertUserInputToTokenName(userInput: string): string {
    return `@${userInput.toLowerCase()}`
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    return tokenName.slice(1)
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    return `@${tokenNameInURLRepresentation}`
  }

  getTokenDisplayName(tokenName: string): string {
    return tokenName
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

  getVerificationSHAPrompt(
    sha: string,
    marketName: string,
    tokenName: string
  ): any {
    return (
      <span>
        Verifying myself on the credibility layer of the internet:{' '}
        <b>
          {sha} attn.to/i/{marketName}/{tokenName}
        </b>
      </span>
    )
  }

  getVerificationSHAPromptExplanation(): string {
    return 'Please post a Tweet containing the code and listing link below. You can edit the text any way you like, as long as the bold text is there. After you have posted the Tweet, click Next. (Note: This must be a new Tweet — a reply to another Tweet will not work properly)'
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `I have posted the Tweet.`
  }
}
