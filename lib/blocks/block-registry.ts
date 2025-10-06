/**
 * Block Registry
 * 
 * Maps WordPress block names to React components
 * Add new blocks here as they're created
 */

import type { ComponentType } from 'react';

// Import block components
import { Hero } from '@/components/blocks/Hero';
import { HeroBasic } from '@/components/blocks/HeroBasic';
import { HeroUltraSimple } from '@/components/blocks/HeroUltraSimple';
import { TestMinimal } from '@/components/blocks/TestMinimal';
// import { CTA } from '@/components/blocks/CTA';
// import { Features } from '@/components/blocks/Features';

/**
 * Registry mapping block names to React components
 * 
 * Format: 'namespace/block-name': Component
 */
export const BLOCK_COMPONENTS: Record<string, ComponentType<any>> = {
  // DapFlow custom blocks
  'dapflow/test-minimal': TestMinimal,
  'dapflow/hero-ultra-simple': HeroUltraSimple,
  'dapflow/hero-basic': HeroBasic,
  'dapflow/hero': Hero,
  'dapflow/hero-simple': Hero, // Hero Simple uses same component
  // 'dapflow/cta': CTA,
  // 'dapflow/features': Features,
};

/**
 * Check if a block is registered
 */
export function isBlockRegistered(blockName: string): boolean {
  return blockName in BLOCK_COMPONENTS;
}

/**
 * Get component for a block name
 */
export function getBlockComponent(blockName: string): ComponentType<any> | null {
  return BLOCK_COMPONENTS[blockName] || null;
}

/**
 * Register a new block component
 * Useful for dynamic registration or testing
 */
export function registerBlock(blockName: string, component: ComponentType<any>): void {
  BLOCK_COMPONENTS[blockName] = component;
}

/**
 * Get all registered block names
 */
export function getRegisteredBlocks(): string[] {
  return Object.keys(BLOCK_COMPONENTS);
}

