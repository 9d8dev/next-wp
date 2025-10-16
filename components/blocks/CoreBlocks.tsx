/**
 * Core WordPress Block Components
 * 
 * React components for rendering core WordPress blocks
 * Uses Tailwind, shadcn/ui, and craft design system
 */

import React from 'react';
import { Section, Container, Prose } from '@/components/craft';
import { Button } from '@/components/ui/button';
import type { WordPressBlock } from '@/lib/blocks/types';

// ====================
// LAYOUT BLOCKS
// ====================

/**
 * Cover Block
 * Background media with nested content
 */
export function CoreCover({ block }: { block: WordPressBlock }) {
  const { innerBlocks = [], attrs } = block;
  const backgroundImageUrl: string | undefined = attrs?.url || attrs?.background?.url;
  const minHeight: number | string = attrs?.minHeight || 480;
  const dimRatio: number = typeof attrs?.dimRatio === 'number' ? attrs.dimRatio : 50; // 0-100
  const overlayColor: string = attrs?.overlayColor || 'black';

  const overlayOpacity = Math.max(0, Math.min(1, dimRatio / 100));

  return (
    <Section>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
      >
        {backgroundImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            aria-hidden="true"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
          aria-hidden="true"
        />
        <div className="relative mx-auto px-6 lg:px-8 py-16" style={{ maxWidth: '85rem' }}>
          <div className="grid gap-6">
            {innerBlocks.map((innerBlock, index) => (
              <CoreBlockRenderer key={index} block={innerBlock} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * Columns Block
 * Responsive multi-column layout
 */
export function CoreColumns({ block }: { block: WordPressBlock }) {
  const { innerBlocks = [], attrs } = block;
  const declaredColumns: number | undefined = attrs?.columns;
  const isStackedOnMobile: boolean = !!attrs?.isStackedOnMobile;
  const numColumns = Math.max(1, Math.min(6, declaredColumns || innerBlocks.length || 2));
  const mobileCols = isStackedOnMobile ? 1 : Math.min(2, numColumns);
  
  if (!innerBlocks.length) return null;

  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div className={`grid grid-cols-${mobileCols} md:grid-cols-${numColumns} lg:grid-cols-${numColumns} gap-8`}>
          {innerBlocks.map((column, index) => (
            <CoreColumn key={index} block={column} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * Column Block
 * Individual column within a columns block
 */
export function CoreColumn({ block }: { block: WordPressBlock }) {
  const { innerBlocks = [] } = block;
  
  return (
    <div className="flex flex-col gap-4">
      {innerBlocks.map((innerBlock, index) => (
        <CoreBlockRenderer key={index} block={innerBlock} />
      ))}
    </div>
  );
}

/**
 * Group Block
 * Generic container for grouping blocks
 */
export function CoreGroup({ block }: { block: WordPressBlock }) {
  const { innerBlocks = [], attrs } = block;
  const backgroundColor = attrs?.backgroundColor;
  
  return (
    <Section className={backgroundColor ? `bg-${backgroundColor}` : ''}>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div className="flex flex-col gap-6">
          {innerBlocks.map((innerBlock, index) => (
            <CoreBlockRenderer key={index} block={innerBlock} />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ====================
// CONTENT BLOCKS
// ====================

/**
 * Paragraph Block
 */
export function CoreParagraph({ block }: { block: WordPressBlock }) {
  const { innerHTML = '', attrs } = block;
  const align = attrs?.align || 'left';
  
  return (
    <Prose>
      <div 
        className={`text-${align}`}
        dangerouslySetInnerHTML={{ __html: innerHTML }}
      />
    </Prose>
  );
}

/**
 * Heading Block
 */
export function CoreHeading({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </Prose>
  );
}

/**
 * List Block
 */
export function CoreList({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </Prose>
  );
}

/**
 * Quote Block
 */
export function CoreQuote({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </Prose>
  );
}

/**
 * Code Block
 */
export function CoreCode({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </Prose>
  );
}

/**
 * Preformatted Block
 */
export function CorePreformatted({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </Prose>
  );
}

// ====================
// MEDIA BLOCKS
// ====================

/**
 * Image Block
 */
export function CoreImage({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    </Section>
  );
}

/**
 * Gallery Block
 */
export function CoreGallery({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    </Section>
  );
}

/**
 * Video Block
 */
export function CoreVideo({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    </Section>
  );
}

/**
 * Audio Block
 */
export function CoreAudio({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    </Section>
  );
}

// ====================
// INTERACTIVE BLOCKS
// ====================

/**
 * Buttons Block
 */
export function CoreButtons({ block }: { block: WordPressBlock }) {
  const { innerBlocks = [], attrs } = block;
  const align = (attrs?.align as 'left' | 'center' | 'right') || 'left';
  
  const alignClasses: Record<'left' | 'center' | 'right', string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };
  
  return (
    <div className={`flex flex-wrap gap-4 my-6 ${alignClasses[align]}`}>
      {innerBlocks.map((button, index) => (
        <CoreButton key={index} block={button} />
      ))}
    </div>
  );
}

/**
 * Button Block
 */
export function CoreButton({ block }: { block: WordPressBlock }) {
  const { innerHTML = '', attrs } = block;
  
  // Extract button text and URL from innerHTML
  const parser = typeof window !== 'undefined' ? new DOMParser() : null;
  let buttonText = 'Button';
  let buttonUrl = '#';
  
  if (parser) {
    const doc = parser.parseFromString(innerHTML, 'text/html');
    const link = doc.querySelector('a');
    if (link) {
      buttonText = link.textContent || 'Button';
      buttonUrl = link.getAttribute('href') || '#';
    }
  } else {
    // Server-side: use regex to extract
    const textMatch = innerHTML.match(/>([^<]+)</);
    const hrefMatch = innerHTML.match(/href="([^"]+)"/);
    if (textMatch) buttonText = textMatch[1];
    if (hrefMatch) buttonUrl = hrefMatch[1];
  }
  
  return (
    <Button asChild>
      <a href={buttonUrl}>{buttonText}</a>
    </Button>
  );
}

// ====================
// FORMATTING BLOCKS
// ====================

/**
 * Separator Block
 */
export function CoreSeparator({ block }: { block: WordPressBlock }) {
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <hr className="my-12 border-border" />
      </div>
    </Section>
  );
}

/**
 * Spacer Block
 */
export function CoreSpacer({ block }: { block: WordPressBlock }) {
  const { attrs } = block;
  const height = attrs?.height || 100;
  
  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}

// ====================
// EMBED BLOCKS
// ====================

/**
 * Embed Block
 * Generic embed handler for YouTube, Twitter, etc.
 */
export function CoreEmbed({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    </Section>
  );
}

// ====================
// TABLE BLOCKS
// ====================

/**
 * Table Block
 */
export function CoreTable({ block }: { block: WordPressBlock }) {
  const { innerHTML = '' } = block;
  
  return (
    <Section>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    </Section>
  );
}

// ====================
// MAIN RENDERER
// ====================

/**
 * Core Block Renderer
 * Routes core WordPress blocks to their React components
 */
export function CoreBlockRenderer({ block }: { block: WordPressBlock }) {
  const { blockName } = block;

  // Layout blocks
  if (blockName === 'core/cover') return <CoreCover block={block} />;
  if (blockName === 'core/columns') return <CoreColumns block={block} />;
  if (blockName === 'core/column') return <CoreColumn block={block} />;
  if (blockName === 'core/group') return <CoreGroup block={block} />;

  // Content blocks
  if (blockName === 'core/paragraph') return <CoreParagraph block={block} />;
  if (blockName === 'core/heading') return <CoreHeading block={block} />;
  if (blockName === 'core/list') return <CoreList block={block} />;
  if (blockName === 'core/quote') return <CoreQuote block={block} />;
  if (blockName === 'core/code') return <CoreCode block={block} />;
  if (blockName === 'core/preformatted') return <CorePreformatted block={block} />;

  // Media blocks
  if (blockName === 'core/image') return <CoreImage block={block} />;
  if (blockName === 'core/gallery') return <CoreGallery block={block} />;
  if (blockName === 'core/video') return <CoreVideo block={block} />;
  if (blockName === 'core/audio') return <CoreAudio block={block} />;

  // Interactive blocks
  if (blockName === 'core/buttons') return <CoreButtons block={block} />;
  if (blockName === 'core/button') return <CoreButton block={block} />;

  // Formatting blocks
  if (blockName === 'core/separator') return <CoreSeparator block={block} />;
  if (blockName === 'core/spacer') return <CoreSpacer block={block} />;

  // Embed blocks
  if (blockName === 'core/embed') return <CoreEmbed block={block} />;
  if (blockName?.startsWith('core/embed-')) return <CoreEmbed block={block} />;

  // Table blocks
  if (blockName === 'core/table') return <CoreTable block={block} />;

  // Fallback: render HTML
  if (block.innerHTML) {
    return (
      <Section>
        <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: '85rem' }}>
          <Prose>
            <div dangerouslySetInnerHTML={{ __html: block.innerHTML }} />
          </Prose>
        </div>
      </Section>
    );
  }

  return null;
}

