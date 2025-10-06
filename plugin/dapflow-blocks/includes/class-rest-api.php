<?php
/**
 * DapFlow REST API Extension
 * 
 * Extends WordPress REST API to expose Gutenberg blocks as structured JSON
 * for consumption by the Next.js frontend.
 */

class DapFlow_REST_API {
    
    /**
     * Initialize REST API extensions
     */
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_fields']);
    }
    
    /**
     * Register custom fields in REST API
     */
    public static function register_fields() {
        // Add 'blocks' field to pages
        register_rest_field('page', 'blocks', [
            'get_callback' => [__CLASS__, 'get_blocks'],
            'schema' => [
                'description' => __('Parsed Gutenberg blocks', 'dapflow-blocks'),
                'type' => 'array',
                'context' => ['view', 'edit'],
            ],
        ]);
        
        // Add 'blocks' field to posts (optional, for future use)
        register_rest_field('post', 'blocks', [
            'get_callback' => [__CLASS__, 'get_blocks'],
            'schema' => [
                'description' => __('Parsed Gutenberg blocks', 'dapflow-blocks'),
                'type' => 'array',
                'context' => ['view', 'edit'],
            ],
        ]);
    }
    
    /**
     * Get blocks for a post/page
     * 
     * @param array $object Post object
     * @return array Processed blocks
     */
    public static function get_blocks($object) {
        $content = get_post_field('post_content', $object['id']);
        
        if (empty($content)) {
            return [];
        }
        
        $blocks = parse_blocks($content);
        
        return self::process_blocks($blocks);
    }
    
    /**
     * Process blocks recursively
     * 
     * @param array $blocks Raw blocks from parse_blocks()
     * @return array Processed blocks
     */
    private static function process_blocks($blocks) {
        $processed = [];
        
        foreach ($blocks as $block) {
            // Skip empty/null blocks
            if (empty($block['blockName'])) {
                continue;
            }
            
            $processed_block = [
                'blockName' => $block['blockName'],
                'attrs' => $block['attrs'] ?? [],
                'innerHTML' => $block['innerHTML'] ?? '',
            ];
            
            // Process inner blocks recursively
            if (!empty($block['innerBlocks'])) {
                $processed_block['innerBlocks'] = self::process_blocks($block['innerBlocks']);
            }
            
            // Add block-specific processing
            $processed_block = self::process_block_attrs($processed_block);
            
            $processed[] = $processed_block;
        }
        
        return $processed;
    }
    
    /**
     * Process individual block attributes
     * Clean up and normalize data for frontend consumption
     * 
     * @param array $block Block data
     * @return array Processed block
     */
    private static function process_block_attrs($block) {
        // Clean up empty attributes
        $block['attrs'] = array_filter($block['attrs'], function($value) {
            return $value !== null && $value !== '';
        });
        
        // Block-specific processing
        switch ($block['blockName']) {
            case 'dapflow/hero':
                $block['attrs'] = self::process_hero_attrs($block['attrs']);
                break;
            
            case 'dapflow/cta':
                $block['attrs'] = self::process_cta_attrs($block['attrs']);
                break;
            
            case 'dapflow/features':
                $block['attrs'] = self::process_features_attrs($block['attrs']);
                break;
        }
        
        return $block;
    }
    
    /**
     * Process Hero block attributes
     */
    private static function process_hero_attrs($attrs) {
        // Combine CTA text and href into objects
        if (isset($attrs['primaryCtaText']) && isset($attrs['primaryCtaHref'])) {
            $attrs['primaryCta'] = [
                'text' => $attrs['primaryCtaText'],
                'href' => $attrs['primaryCtaHref'],
            ];
            unset($attrs['primaryCtaText'], $attrs['primaryCtaHref']);
        }
        
        if (isset($attrs['secondaryCtaText']) && isset($attrs['secondaryCtaHref'])) {
            $attrs['secondaryCta'] = [
                'text' => $attrs['secondaryCtaText'],
                'href' => $attrs['secondaryCtaHref'],
            ];
            unset($attrs['secondaryCtaText'], $attrs['secondaryCtaHref']);
        }
        
        if (isset($attrs['badgeText']) && isset($attrs['badgeHref'])) {
            $attrs['badge'] = [
                'text' => $attrs['badgeText'],
                'href' => $attrs['badgeHref'],
            ];
            unset($attrs['badgeText'], $attrs['badgeHref']);
        }
        
        return $attrs;
    }
    
    /**
     * Process CTA block attributes
     */
    private static function process_cta_attrs($attrs) {
        if (isset($attrs['ctaText']) && isset($attrs['ctaHref'])) {
            $attrs['cta'] = [
                'text' => $attrs['ctaText'],
                'href' => $attrs['ctaHref'],
            ];
            unset($attrs['ctaText'], $attrs['ctaHref']);
        }
        
        return $attrs;
    }
    
    /**
     * Process Features block attributes
     */
    private static function process_features_attrs($attrs) {
        // Features should already be an array of objects
        // Just ensure proper structure
        if (isset($attrs['features']) && is_array($attrs['features'])) {
            $attrs['features'] = array_map(function($feature) {
                return [
                    'icon' => $feature['icon'] ?? '',
                    'title' => $feature['title'] ?? '',
                    'description' => $feature['description'] ?? '',
                ];
            }, $attrs['features']);
        }
        
        return $attrs;
    }
}

