import { Tag as TagProps } from '~/types'

export default function Tag({ name }: TagProps) {
  return (
    <span className="bg-brand-soft text-brand text-[0.75rem] rounded-full px-2 py-0.5 font-medium">
      {name}
    </span>
  )
}
