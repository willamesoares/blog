import { NavLink } from 'react-router-dom'
import { POST_TYPE } from '~/constants'

const items = [
  { label: 'Tech', path: '/', end: true },
  { label: 'Off-topic', path: `/${POST_TYPE.NON_TECH}`, end: false },
]

export default function PostsNav() {
  return (
    <nav
      aria-label="Post categories"
      className="flex items-center gap-3 text-[1rem] py-2 mb-2"
    >
      {items.map(({ label, path, end }, index) => (
        <span key={path} className="flex items-center gap-3">
          {index > 0 ? (
            <span aria-hidden="true" className="text-text-muted/60">·</span>
          ) : null}
          <NavLink
            to={path}
            end={end}
            className={({ isActive }) =>
              [
                'py-1 transition-colors no-underline visited:text-current',
                isActive
                  ? 'text-text font-bold'
                  : 'text-text-muted hover:text-text',
              ].join(' ')
            }
          >
            {label}
          </NavLink>
        </span>
      ))}
    </nav>
  )
}
