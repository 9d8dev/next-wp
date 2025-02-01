// common types that are reused across multiple entities
interface WPEntity {
	id: number;
	date: string;
	date_gmt: string;
	modified: string;
	modified_gmt: string;
	slug: string;
	status: "publish" | "future" | "draft" | "pending" | "private";
	link: string;
	guid: {
		rendered: string;
	};
}

interface RenderedContent {
	rendered: string;
	protected: boolean;
}

interface RenderedTitle {
	rendered: string;
}

// media types
interface MediaSize {
	file: string;
	width: number;
	height: number;
	mime_type: string;
	source_url: string;
}

interface MediaDetails {
	width: number;
	height: number;
	file: string;
	sizes: Record<string, MediaSize>;
}

export interface FeaturedMedia extends WPEntity {
	title: RenderedTitle;
	author: number;
	caption: {
		rendered: string;
	};
	alt_text: string;
	media_type: string;
	mime_type: string;
	media_details: MediaDetails;
	source_url: string;
}

type SchemaGraphItem =
	| {
			"@type": "Article";
			"@id": string;
			isPartOf: { "@id": string };
			author: { name: string; "@id": string };
			headline: string;
			datePublished: string;
			dateModified: string;
			mainEntityOfPage: { "@id": string };
			wordCount?: number;
			commentCount?: number;
			publisher: { "@id": string };
			image?: { "@id": string };
			thumbnailUrl?: string;
			keywords?: string[];
			inLanguage?: string;
	  }
	| {
			"@type": "WebPage";
			"@id": string;
			url: string;
			name: string;
			isPartOf: { "@id": string };
			primaryImageOfPage?: { "@id": string };
			image?: { "@id": string };
			thumbnailUrl?: string;
			datePublished?: string;
			dateModified?: string;
			breadcrumb?: { "@id": string };
			inLanguage?: string;
	  }
	| {
			"@type": "ImageObject";
			"@id": string;
			url: string;
			contentUrl: string;
			width?: number;
			height?: number;
			caption?: string;
	  }
	| {
			"@type": "BreadcrumbList";
			"@id": string;
			itemListElement: {
				"@type": "ListItem";
				position: number;
				name: string;
				item: string;
			}[];
	  }
	| {
			"@type": "Person";
			"@id": string;
			name: string;
			image?: { "@id": string };
			url?: string;
	  }
	| {
			"@type": "Organization";
			"@id": string;
			name: string;
			url: string;
			logo?: { "@id": string };
			image?: { "@id": string };
			sameAs?: string[];
	  };

// content types
export interface Post extends WPEntity {
	title: RenderedTitle;
	content: RenderedContent;
	excerpt: RenderedContent;
	author: number;
	featured_media: number;
	comment_status: "open" | "closed";
	ping_status: "open" | "closed";
	sticky: boolean;
	template: string;
	format:
		| "standard"
		| "aside"
		| "chat"
		| "gallery"
		| "link"
		| "image"
		| "quote"
		| "status"
		| "video"
		| "audio";
	categories: number[];
	tags: number[];
	meta: Record<string, unknown>;
	yoast_head_json: {
		title: string;
		description: string;
		robots: {
			index: string;
			follow: string;
			"max-snippet": string;
			"max-image-preview": string;
			"max-video-preview": string;
		};
		og_locale: string;
		og_type: string;
		og_title: string;
		og_description: string;
		og_url: string;
		og_site_name: string;
		article_published_time: string;
		og_image: {
			url: string;
			width?: number;
			height?: number;
			type?: string;
			alt?: string;
		}[];
		author: string;
		twitter_card: string;
		twitter_misc: Record<string, string>; // allows dynamic twitter labels
		schema: {
			"@context": string;
			"@graph": SchemaGraphItem[];
		};
	};
}

export interface Page extends WPEntity {
	title: RenderedTitle;
	content: RenderedContent;
	excerpt: RenderedContent;
	author: number;
	featured_media: number;
	parent: number;
	menu_order: number;
	comment_status: "open" | "closed";
	ping_status: "open" | "closed";
	template: string;
	meta: Record<string, unknown>;
}

// taxonomy types
interface Taxonomy {
	id: number;
	count: number;
	description: string;
	link: string;
	name: string;
	slug: string;
	meta: Record<string, unknown>;
}

export interface Category extends Taxonomy {
	taxonomy: "category";
	parent: number;
}

export interface Tag extends Taxonomy {
	taxonomy: "post_tag";
}

export interface Author {
	id: number;
	name: string;
	url: string;
	description: string;
	link: string;
	slug: string;
	avatar_urls: Record<string, string>;
	meta: Record<string, unknown>;
}

// block types
interface BlockSupports {
	align?: boolean | string[];
	anchor?: boolean;
	className?: boolean;
	color?: {
		background?: boolean;
		gradients?: boolean;
		text?: boolean;
	};
	spacing?: {
		margin?: boolean;
		padding?: boolean;
	};
	typography?: {
		fontSize?: boolean;
		lineHeight?: boolean;
	};
	[key: string]: unknown;
}

interface BlockStyle {
	name: string;
	label: string;
	isDefault: boolean;
}

export interface BlockType {
	api_version: number;
	title: string;
	name: string;
	description: string;
	icon: string;
	category: string;
	keywords: string[];
	parent: string[];
	supports: BlockSupports;
	styles: BlockStyle[];
	textdomain: string;
	example: Record<string, unknown>;
	attributes: Record<string, unknown>;
	provides_context: Record<string, string>;
	uses_context: string[];
	editor_script: string;
	script: string;
	editor_style: string;
	style: string;
}

export interface EditorBlock {
	id: string;
	name: string;
	attributes: Record<string, unknown>;
	innerBlocks: EditorBlock[];
	innerHTML: string;
	innerContent: string[];
}

export interface TemplatePart {
	id: string;
	slug: string;
	theme: string;
	type: string;
	source: string;
	origin: string;
	content: string | EditorBlock[];
	title: {
		raw: string;
		rendered: string;
	};
	description: string;
	status: "publish" | "future" | "draft" | "pending" | "private";
	wp_id: number;
	has_theme_file: boolean;
	author: number;
	area: string;
}

export interface SearchResult {
	id: number;
	title: string;
	url: string;
	type: string;
	subtype: string;
	_links: {
		self: Array<{
			embeddable: boolean;
			href: string;
		}>;
		about: Array<{
			href: string;
		}>;
	};
}

// component props types
export interface FilterBarProps {
	authors: Author[];
	tags: Tag[];
	categories: Category[];
	selectedAuthor?: Author["id"];
	selectedTag?: Tag["id"];
	selectedCategory?: Category["id"];
	onAuthorChange?: (authorId: Author["id"] | undefined) => void;
	onTagChange?: (tagId: Tag["id"] | undefined) => void;
	onCategoryChange?: (categoryId: Category["id"] | undefined) => void;
}
