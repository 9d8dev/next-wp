// Common types that are reused across multiple entities
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
  title: RenderedTitle;
  author: number;
}

interface RenderedContent {
  rendered: string;
  protected: boolean;
}

interface RenderedTitle {
  rendered: string;
}

// Media types
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

export interface WPMedia extends WPEntity {
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

// Content types
export interface WPPost extends WPEntity {
  type: string;
  content: RenderedContent;
  excerpt: RenderedContent;
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
  author_meta: {
    display_name: string;
    author_link: string;
  };
  featured_img: string | null;
  featured_img_caption: string;
  _links?: Record<string, Array<Record<string, any>>>;
  _embedded?: {
    author: Author;
    "wp:featuredmedia": WPMedia[];
    "wp:term": Array<Array<Category | Tag>>; 
  };
}

export interface WPPage extends WPEntity {
  content: RenderedContent;
  excerpt: RenderedContent;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: Record<string, unknown>;
}

// Taxonomy types
interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  meta?: Record<string, unknown>;
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
  avatar_urls?: Record<string, string>;
  meta?: Record<string, unknown>;
}

// Block types
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

// Component Props Types
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

export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

interface BaseQuery<T> {
  context?: "view" | "embed" | "edit"; // Scope under which the request is made; determines fields present in response.
  page?: number; // Current page of the collection.
  per_page?: number; // Maximum number of items to be returned in result set.
  search?: string; // Limit results to those matching a string.
  exclude?: Array<number>; // Ensure result set excludes specific IDs.
  include?: Array<number>; // Limit result set to specific IDs.
  offset?: number; // Offset the result set by a specific number of items.
  order?: "asc" | "desc"; // Order sort attribute ascending or descending.
  orderby?: string; // Sort collection by attribute.
  slug?: string | Array<string>; // Limit result set to posts with one or more specific slugs.
  _fields?: keyof T | Array<keyof T>; // Return only a subset of the fields in a response
  _embed?: boolean; // Include embedded resources
}

interface EntityQuery<T> extends BaseQuery<T> {
  after?: string; // Limit response to posts published after a given ISO8601 compliant date.
  modified_after?: string; // Limit response to posts modified after a given ISO8601 compliant date.
  author?: number | string | Array<number | string>; // Limit result set to posts assigned to specific authors.
  author_exclude?: number | string | Array<number | string>; // Ensure result set excludes posts assigned to specific authors.
  before?: string; // Limit response to posts published before a given ISO8601 compliant date.
  modified_before?: string; // Limit response to posts modified before a given ISO8601 compliant date.
  orderby?: "author" | "date" | "id" | "include" | "modified" | "parent" | "relevance" | "slug" | "include_slugs" | "title";
  search_columns?: Array<string>; // Array of column names to be searched.
  status?: "publish" | "future" | "draft" | "pending" | "private"; // Limit result set to posts assigned one or more statuses.
}

export interface PostQuery extends EntityQuery<WPPost> {
  tax_relation?: "AND" | "OR"; // Limit result set based on relationship between multiple taxonomies.
  categories?: number | string | Array<number | string>; // Limit result set to items with specific terms assigned in the categories
  categories_exclude?: number | string | Array<number | string>; // Limit result set to items except those with specific terms assigned in the categories taxonomy.
  tags?: number | string | Array<number | string>; // Limit result set to items with specific terms assigned in the tags taxonomy.
  tags_exclude?: number | string | Array<number | string>; // Limit result set to items except those with specific terms assigned in the tags taxonomy.
  sticky?: boolean; // Limit result set to items that are sticky.
}

export interface PageQuery extends EntityQuery<WPPage> {
  parent?: number | Array<number>; // Limit result set to items with particular parent IDs.
  parent_exclude?: number | Array<number>; // Limit result set to all items except those of a particular parent ID.
  menu_order?: number; // Limit result set to posts with a specific menu_order value.
}

export interface MediaQuery extends EntityQuery<WPMedia> {
  parent?: number | Array<number>; // Limit result set to items with particular parent IDs.
  parent_exclude?: number | Array<number>; // Limit result set to all items except those of a particular parent ID.
  media_type?: "image" | "video" | "text" | "application" | "audio"; // Limit result set to attachments of a particular media type.
  mime_type?: string; // Limit result set to attachments of a particular MIME type.
}

interface TaxonomyQuery<T> extends BaseQuery<T> {
  hide_empty?: boolean; // Whether to hide terms not assigned to any posts.
  post?: number; // Limit result set to terms assigned to a specific post.
  orderby?: "id" | "include" | "name" | "slug" | "include_slugs" | "term_group" | "description" | "count";
}
export type TagQuery = TaxonomyQuery<Tag>;
export interface CategoryQuery extends TaxonomyQuery<Category> {
  parent?: number; // Limit result set to terms assigned to a specific parent.
}

interface AuthorQuery<T> extends BaseQuery<Author> {
  roles?: string | Array<string>; // Limit result set to users matching at least one specific role provided.
  capabilities?: string | Array<string>; // Limit result set to users matching at least one specific capability provided.
  who?: boolean; // Limit result set to users who are considered authors
  has_published_posts?: boolean; // Limit result set to users who have published posts.
}

type Flatten<T> = T extends any[] ? T[number] : T;

export type WordPressQuery<T> =
  Flatten<T> extends WPPost ? PostQuery :
  Flatten<T> extends WPPage ? PageQuery :
  Flatten<T> extends WPMedia ? MediaQuery :
  Flatten<T> extends Tag ? TagQuery :
  Flatten<T> extends Category ? CategoryQuery :
  Flatten<T> extends Author ? AuthorQuery :
  BaseQuery<Flatten<T>>;

export type CacheTag = "wordpress"
  | "posts"
  | `post-${number | string}`
  | `posts-category-${number | string}`
  | `posts-tag-${number | string}`
  | `posts-author-${number | string}`
  | "categories"
  | `category-${number | string}`
  | "tags"
  | `tag-${number | string}`
  | "authors"
  | `author-${number | string}`
  | "media"
  | `media-${number | string}`
  | "pages"
  | `page-${number | string}`;