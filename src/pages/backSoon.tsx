import { EmailForm, Footer } from 'components'
import Image from 'next/image'

const BackSoon = () => {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-brand-navy">
      <div className="relative flex flex-col items-center justify-center w-3/4 h-3/5 bg-white rounded-lg">
        <div className="relative w-56 h-56">
          <Image
            src="/logo.png"
            alt="Workflow logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <span className="text-6xl font-bold text-brand-navy mt-3">
          We’ll be back in a few hours.
        </span>
        <span className="text-3xl italic font-light text-brand-navy mb-6 mt-12">
          Sign up here to get notified:
        </span>
        <EmailForm isMaintenance={true} />
        <span className="mb-12"></span>
        <div className="absolute w-5/6 h-5/6">
          <Image
            src="/MaintenanceBg.svg"
            alt="Workflow logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="w-3/4 mt-16 text-white">
        <Footer />
      </div>
    </div>
  )
}

export default BackSoon
