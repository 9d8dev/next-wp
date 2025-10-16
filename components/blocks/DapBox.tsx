/**
 * DapFlow Box Block - Frontend Component
 * 
 * Flexible container with variants for cards, content boxes, and sections
 */

import React from 'react';
import { BlockRenderer } from '@/lib/blocks/block-renderer';
import type { WordPressBlock } from '@/lib/blocks/types';

interface DapBoxProps {
  block: WordPressBlock;
}

export function DapBox({ block }: DapBoxProps) {
  const { innerBlocks = [], attrs } = block;
  const { variant, padding, bgColor, borderRadius, border, shadow } = attrs;

  // Default values
  const defaultVariant = 'default';
  const defaultPadding = { mobile: 'p-4', tablet: 'p-6', desktop: 'p-8' };
  const defaultBgColor = 'bg-transparent';
  const defaultBorderRadius = 'rounded-lg';
  const defaultBorder = false;
  const defaultShadow = 'none';

  // Use provided values or defaults
  const boxVariant = variant || defaultVariant;
  const boxPadding = padding || defaultPadding;
  const boxBgColor = bgColor || defaultBgColor;
  const boxBorderRadius = borderRadius || defaultBorderRadius;
  const boxBorder = border !== undefined ? border : defaultBorder;
  const boxShadow = shadow || defaultShadow;

  // Get variant classes
  const getVariantClasses = () => {
    const baseClasses = `${boxBgColor} ${boxBorderRadius}`;
    
    switch (boxVariant) {
      case 'elevated':
        return `${baseClasses} shadow-lg`;
      case 'bordered':
        return `${baseClasses} border border-gray-200`;
      case 'card':
        return `${baseClasses} bg-white shadow-md border border-gray-100`;
      default:
        return baseClasses;
    }
  };

  // Add shadow if specified
  const shadowClass = boxShadow !== 'none' ? boxShadow : '';
  const borderClass = boxBorder ? 'border border-gray-200' : '';

  return (
    <div 
      className={`${getVariantClasses()} ${boxPadding.mobile} md:${boxPadding.tablet} lg:${boxPadding.desktop} ${shadowClass} ${borderClass}`}
    >
      {innerBlocks.map((innerBlock, index) => (
        <BlockRenderer key={index} blocks={[innerBlock]} />
      ))}
    </div>
  );
}
