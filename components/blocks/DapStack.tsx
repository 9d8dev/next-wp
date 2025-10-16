/**
 * DapFlow Stack Block - Frontend Component
 * 
 * Vertical stacking of blocks with responsive spacing
 */

import React from 'react';
import { BlockRenderer } from '@/lib/blocks/block-renderer';
import type { WordPressBlock } from '@/lib/blocks/types';

interface DapStackProps {
  block: WordPressBlock;
}

export function DapStack({ block }: DapStackProps) {
  const { innerBlocks = [], attrs } = block;
  const { gap, align, maxWidth } = attrs;

  // Default values
  const defaultGap = { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' };
  const defaultAlign = 'stretch';
  const defaultMaxWidth = '85rem';

  // Use provided values or defaults
  const stackGap = gap || defaultGap;
  const stackAlign = align || defaultAlign;
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
        className={`flex flex-col ${stackGap.mobile} md:${stackGap.tablet} lg:${stackGap.desktop} items-${stackAlign}`}
      >
        {innerBlocks.map((innerBlock, index) => (
          <BlockRenderer key={index} blocks={[innerBlock]} />
        ))}
      </div>
    </div>
  );
}
