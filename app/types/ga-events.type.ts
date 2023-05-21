export type GAEvent = {
	action: string,
	category: string,
	label?: string,
	value?: string
}

export enum GAEventAction {
	PostClick = 'post_click',
	SocialClick = 'social_click'
}

export enum GAEventCategory {
	NonTech = 'non_tech',
	Tech = 'tech'
}
