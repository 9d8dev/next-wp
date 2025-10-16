/**
 * DapFlow Grid Block - Frontend Component
 * 
 * Responsive grid layout with customizable columns and spacing
 */

import React from 'react';
import { BlockRenderer } from '@/lib/blocks/block-renderer';
import type { WordPressBlock } from '@/lib/blocks/types';

interface DapGridProps {
  block: WordPressBlock;
}

export function DapGrid({ block }: DapGridProps) {
  const { innerBlocks = [], attrs } = block;
  const { columns, gap, align, maxWidth } = attrs;

  // Default values
  const defaultColumns = { mobile: 1, tablet: 2, desktop: 3 };
  const defaultGap = { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' };
  const defaultAlign = 'stretch';
  const defaultMaxWidth = '85rem';

  // Use provided values or defaults
  const gridColumns = columns || defaultColumns;
  const gridGap = gap || defaultGap;
  const gridAlign = align || defaultAlign;
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
        className={`grid grid-cols-${gridColumns.mobile} md:grid-cols-${gridColumns.tablet} lg:grid-cols-${gridColumns.desktop} ${gridGap.mobile} md:${gridGap.tablet} lg:${gridGap.desktop} items-${gridAlign}`}
      >
        {innerBlocks.map((innerBlock, index) => (
          <BlockRenderer key={index} blocks={[innerBlock]} />
        ))}
      </div>
    </div>
  );
}
