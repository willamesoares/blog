import { Tag as TagProps } from '~/types'

export default function Tag({ name }: TagProps) {
  return (
    <span className="bg-[lightblue] text-black text-[0.8rem] rounded-[0.1rem] px-[0.4rem] py-[0.3rem] font-bold">
      {name}
    </span>
  )
}
