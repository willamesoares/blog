import { Link } from 'react-router-dom'
import { POST_TYPE } from '~/constants'

type TabsProps = {
  activeTab?: number
}

const tabs = [
  { label: 'tech posts', path: '/' },
  { label: 'everything else', path: `/${POST_TYPE.NON_TECH}` },
]

export default function Tabs({ activeTab = 0 }: TabsProps) {
  return (
    <div className="flex justify-between text-center tracking-[1.2px] items-center border-b border-[#d3d3d361]">
      {tabs.map(({ label, path }, index) => {
        const isActive = index === activeTab
        return (
          <h5
            key={label}
            className={[
              'flex-1 py-[0.6rem] m-0 cursor-pointer',
              isActive
                ? 'shadow-[0px_2px_0px_0px_#2ea086] border-b border-brand'
                : '',
            ].join(' ')}
          >
            <Link to={path} className="no-underline text-black visited:text-black">
              {label}
            </Link>
          </h5>
        )
      })}
    </div>
  )
}
