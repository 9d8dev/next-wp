/**
 * Core Block Renderer
 * 
 * Fallback renderer for core WordPress blocks
 * Provides basic rendering using our design system
 */

import React from 'react';
import type { WordPressBlock } from './types';
import { Prose } from '@/components/craft';

/**
 * Render core WordPress blocks
 * These are fallbacks for standard WordPress blocks
 */
export function CoreBlockRenderer({ block }: { block: WordPressBlock }) {
  const { blockName, attrs, innerHTML, innerBlocks } = block;

  // Handle blocks with inner blocks (like columns, groups)
  if (innerBlocks && innerBlocks.length > 0) {
    const { BlockRenderer } = require('./block-renderer');
    return <BlockRenderer blocks={innerBlocks} />;
  }

  // For most core blocks, we can safely render the HTML
  // WordPress already sanitizes this content
  if (innerHTML && innerHTML.trim()) {
    return <div dangerouslySetInnerHTML={{ __html: innerHTML }} />;
  }

  // Handle blocks without HTML (empty blocks, etc.)
  return null;
}

/**
 * Core block-specific renderers (if needed in the future)
 * Can add custom rendering for specific core blocks
 */

export function CoreParagraph({ content, align }: { content: string; align?: string }) {
  return (
    <Prose>
      <p 
        className={align ? `text-${align}` : ''}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Prose>
  );
}

export function CoreHeading({ 
  content, 
  level, 
  align 
}: { 
  content: string; 
  level: 1 | 2 | 3 | 4 | 5 | 6; 
  align?: string;
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Prose>
      <Tag 
        className={align ? `text-${align}` : ''}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Prose>
  );
}

