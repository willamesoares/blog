import { useNavigate } from 'react-router-dom'
import { GAEventAction } from '~/types/ga-events.type'
import * as gtag from '~/utils/gtags'

const links = {
  github: 'https://github.com/willamesoares',
  linkedin: 'https://www.linkedin.com/in/willamesoares/',
  twitter: 'https://twitter.com/soawillb',
  spotify: 'https://open.spotify.com/user/12142416238?si=413f855243db43fd',
}

export default function Header() {
  const navigate = useNavigate()

  const handleSocialLinkClick = (networkName: string, link: string) => {
    gtag.event({
      action: GAEventAction.SocialClick,
      category: 'social_network',
      label: networkName,
      value: link,
    })
  }

  return (
    <header className="bg-header-bg fixed right-0 left-0 top-0 z-10 border-b border-border">
      <div className="flex justify-between items-center max-w-[768px] mx-auto px-5 py-4 tablet:py-5">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xl tablet:text-2xl font-bold tracking-tight text-text hover:text-brand transition-colors"
        >
          Will Soares
        </button>
        <div className="flex gap-3 tablet:gap-4">
          {Object.entries(links).map(([name, href]) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialLinkClick(name, href)}
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label={`${name} profile`}
            >
              <img
                src={`/${name}-icon.svg`}
                alt=""
                className="w-[1.5rem] h-[1.5rem]"
              />
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
