import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="bg-header-bg fixed right-0 left-0 top-0 z-10 border-b border-border">
      <div className="flex justify-between items-center max-w-[768px] mx-auto px-5 py-4 tablet:py-5">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xl tablet:text-2xl font-bold tracking-tight text-text hover:text-brand transition-colors"
        >
          TheMindHopper
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="TheMindHopper home"
        >
          <img
            src="/favicon-200x200.png"
            alt=""
            className="w-8 h-8 tablet:w-9 tablet:h-9 rounded-md"
          />
        </button>
      </div>
    </header>
  )
}
