/**
 * TypeScript types for WordPress blocks and block attributes
 */

export interface WordPressBlock {
  blockName: string;
  attrs: Record<string, any>;
  innerBlocks?: WordPressBlock[];
  innerHTML?: string;
}

export interface BlockRendererProps {
  blocks: WordPressBlock[];
  fallback?: React.ReactNode;
}

// Hero Block
export interface HeroBlockAttributes {
  title: string;
  subtitle: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  badge?: {
    text: string;
    linkText?: string;
    linkHref?: string;
  };
  navigation?: Array<{ name: string; href: string }>;
  logoUrl?: string;
  logoAlt?: string;
  bgColor?: string;
  textColor?: string;
  showDecorations?: boolean;
}

// CTA Block
export interface CTABlockAttributes {
  title: string;
  description: string;
  cta: {
    text: string;
    href: string;
  };
  bgColor?: string;
  layout?: 'centered' | 'split';
}

// Feature Item
export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

// Features Block
export interface FeaturesBlockAttributes {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  layout?: 'grid' | 'list';
}

// Core WordPress Blocks (for fallback rendering)
export interface CoreParagraphAttributes {
  content: string;
  align?: 'left' | 'center' | 'right';
}

export interface CoreHeadingAttributes {
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right';
}

export interface CoreImageAttributes {
  url: string;
  alt: string;
  caption?: string;
  align?: 'left' | 'center' | 'right' | 'wide' | 'full';
}

export interface CoreButtonAttributes {
  text: string;
  url: string;
  linkTarget?: string;
  rel?: string;
  placeholder?: string;
}

