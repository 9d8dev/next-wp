/**
 * DapFlow Row Block - Frontend Component
 * 
 * Horizontal arrangement of blocks with responsive controls
 */

import React from 'react';
import { BlockRenderer } from '@/lib/blocks/block-renderer';
import type { WordPressBlock } from '@/lib/blocks/types';

interface DapRowProps {
  block: WordPressBlock;
}

export function DapRow({ block }: DapRowProps) {
  const { innerBlocks = [], attrs } = block;
  const { gap, align, justify, wrap, maxWidth } = attrs;

  // Default values
  const defaultGap = { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' };
  const defaultAlign = 'start';
  const defaultJustify = 'start';
  const defaultWrap = true;
  const defaultMaxWidth = '85rem';

  // Use provided values or defaults
  const rowGap = gap || defaultGap;
  const rowAlign = align || defaultAlign;
  const rowJustify = justify || defaultJustify;
  const rowWrap = wrap !== undefined ? wrap : defaultWrap;
  const containerMaxWidth = maxWidth || defaultMaxWidth;

  if (!innerBlocks.length) {
    return null;
  }

  return (
    <div 
      className="mx-auto px-6 lg:px-8"
      style={{ maxWidth: containerMaxWidth }}
    >
      <div 
        className={`flex ${rowWrap ? 'flex-wrap' : 'flex-nowrap'} ${rowGap.mobile} md:${rowGap.tablet} lg:${rowGap.desktop} items-${rowAlign} justify-${rowJustify}`}
      >
        {innerBlocks.map((innerBlock, index) => (
          <BlockRenderer key={index} blocks={[innerBlock]} />
        ))}
      </div>
    </div>
  );
}
