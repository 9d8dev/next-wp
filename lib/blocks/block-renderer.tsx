/**
 * Block Renderer
 * 
 * Renders WordPress blocks as React components
 * Maps block data from WordPress REST API to React components
 */

import React from 'react';
import type { WordPressBlock, BlockRendererProps } from './types';
import { BLOCK_COMPONENTS } from './block-registry';
import { CoreBlockRenderer } from './core-blocks';

/**
 * Main Block Renderer Component
 * 
 * @param blocks - Array of blocks from WordPress REST API
 * @param fallback - Optional fallback content for unknown blocks
 */
export function BlockRenderer({ blocks, fallback }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => (
        <BlockComponent 
          key={`${block.blockName}-${index}`} 
          block={block} 
          fallback={fallback}
        />
      ))}
    </>
  );
}

/**
 * Individual Block Component
 * Routes to the appropriate component based on block name
 */
function BlockComponent({ 
  block, 
  fallback 
}: { 
  block: WordPressBlock; 
  fallback?: React.ReactNode;
}) {
  // Get the component for this block type
  const Component = BLOCK_COMPONENTS[block.blockName];
  // Blocks that expect the full WordPressBlock via `block` prop
  const PRIMITIVE_BLOCKS = new Set([
    'dap/grid',
    'dap/box',
    'dap/row',
    'dap/stack',
  ]);

  // If we have a custom component, use it
  if (Component) {
    if (PRIMITIVE_BLOCKS.has(block.blockName)) {
      return <Component block={block} />;
    }
    // Default: pass attributes for presentation components (e.g., Hero blocks)
    return <Component {...block.attrs} innerBlocks={block.innerBlocks} />;
  }

  // Try core WordPress block renderer
  if (block.blockName.startsWith('core/')) {
    return <CoreBlockRenderer block={block} />;
  }

  // Unknown block - use fallback or render HTML
  if (fallback) {
    return <>{fallback}</>;
  }

  // Last resort: render the HTML if available
  if (block.innerHTML) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: block.innerHTML }}
        data-block-type={block.blockName}
      />
    );
  }

  // Log warning for unknown blocks in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Unknown block type: ${block.blockName}`, block);
  }

  return null;
}

/**
 * Export for convenience
 */
export { CoreBlockRenderer };

