/**
 * Block Parser
 * 
 * Utilities for parsing and normalizing WordPress block data
 */

import type { WordPressBlock } from './types';

/**
 * Parse blocks from WordPress content
 * This is mainly used if we need to do additional processing
 */
export function parseBlocks(blocks: WordPressBlock[]): WordPressBlock[] {
  return blocks.map(normalizeBlock);
}

/**
 * Normalize a block's structure
 * Ensures consistent data format for frontend rendering
 */
function normalizeBlock(block: WordPressBlock): WordPressBlock {
  const normalized: WordPressBlock = {
    blockName: block.blockName,
    attrs: block.attrs || {},
    innerHTML: block.innerHTML || '',
  };

  // Process inner blocks recursively
  if (block.innerBlocks && block.innerBlocks.length > 0) {
    normalized.innerBlocks = block.innerBlocks.map(normalizeBlock);
  }

  return normalized;
}

/**
 * Filter blocks by name
 */
export function filterBlocksByName(
  blocks: WordPressBlock[],
  blockName: string
): WordPressBlock[] {
  const filtered: WordPressBlock[] = [];

  for (const block of blocks) {
    if (block.blockName === blockName) {
      filtered.push(block);
    }

    // Search in inner blocks
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      filtered.push(...filterBlocksByName(block.innerBlocks, blockName));
    }
  }

  return filtered;
}

/**
 * Get all block names used in content
 */
export function getBlockNames(blocks: WordPressBlock[]): string[] {
  const names = new Set<string>();

  function collectNames(blocks: WordPressBlock[]) {
    for (const block of blocks) {
      names.add(block.blockName);

      if (block.innerBlocks && block.innerBlocks.length > 0) {
        collectNames(block.innerBlocks);
      }
    }
  }

  collectNames(blocks);
  return Array.from(names);
}

/**
 * Check if blocks array contains a specific block type
 */
export function hasBlock(blocks: WordPressBlock[], blockName: string): boolean {
  return getBlockNames(blocks).includes(blockName);
}

/**
 * Flatten nested blocks into a single array
 */
export function flattenBlocks(blocks: WordPressBlock[]): WordPressBlock[] {
  const flattened: WordPressBlock[] = [];

  function flatten(blocks: WordPressBlock[]) {
    for (const block of blocks) {
      flattened.push(block);

      if (block.innerBlocks && block.innerBlocks.length > 0) {
        flatten(block.innerBlocks);
      }
    }
  }

  flatten(blocks);
  return flattened;
}

