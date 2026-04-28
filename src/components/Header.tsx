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
    <header className="bg-header-bg fixed right-0 left-0 top-0 z-10">
      <div className="flex justify-between items-center max-w-[768px] mx-auto px-[1.125rem]">
        <h2
          className="text-2xl tablet:text-[1.8rem] tracking-[3px] cursor-pointer"
          onClick={() => navigate('/')}
        >
          Will Soares
        </h2>
        <div className="flex gap-2 tablet:gap-4">
          {Object.entries(links).map(([name, href]) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialLinkClick(name, href)}
            >
              <img
                src={`/${name}-icon.svg`}
                alt={`${name} profile`}
                className="w-[1.3rem] h-[1.3rem] cursor-pointer"
              />
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
