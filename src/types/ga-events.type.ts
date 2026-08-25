export type GAEvent = {
  action: string
  category: string
  label?: string
  value?: string
}

export enum GAEventAction {
  PostClick = 'post_click',
}

export enum GAEventCategory {
  Post = 'post',
}
