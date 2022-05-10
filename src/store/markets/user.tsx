import { IMarketSpecifics } from '.'
import TwitterOutlineWhite from '../../assets/twitter-outline-white.svg'
import TwitterOutlineBlack from '../../assets/twitter-outline-black.svg'
import { queryLambdavatar } from 'actions'
import classNames from 'classnames'

export default class UserMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'User'
  }

  isEnabled(): boolean {
    return true
  }

  getMarketNameURLRepresentation(): string {
    return 'user'
  }

  // TODO
  getMarketSVGBlack(): JSX.Element {
    return <TwitterOutlineBlack className="w-5" />
  }

  // TODO
  getMarketSVGWhite(): JSX.Element {
    return <TwitterOutlineWhite className="w-5" />
  }

  // TODO
  getMarketSVGTheme(theme?, isActive = false): JSX.Element {
    if (theme === 'dark') {
      return (
        <TwitterOutlineWhite
          className={classNames(
            isActive ? 'stroke-blue-500' : 'stroke-white',
            'w-5'
          )}
        />
      )
    } else {
      return (
        <TwitterOutlineBlack
          className={classNames(
            isActive ? 'stroke-blue-500' : 'stroke-black',
            'w-5'
          )}
        />
      )
    }
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    return `/u/${tokenName}`
  }

  getTokenIconURL(tokenName: string): Promise<string> {
    return queryLambdavatar({
      rawMarketName: this.getMarketNameURLRepresentation(),
      rawTokenName: this.getTokenNameURLRepresentation(tokenName),
    })
  }

  /**
   * Convert URL input to token value that will be stored on blockchain
   */
  convertUserInputToTokenName(userInput: string): string {
    if (!userInput) return null
    return `${userInput.toLowerCase()}`
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    return tokenName
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    return `${tokenNameInURLRepresentation}`
  }

  getTokenDisplayName(tokenName: string): string {
    return tokenName
  }

  // List Token

  getListTokenPrefix(): string {
    return ''
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
    listingId: string
  ): any {
    return (
      <span>
        Verifying myself on the credibility layer of the internet:{' '}
        <b>
          {sha} attn.to/post/{listingId}
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
