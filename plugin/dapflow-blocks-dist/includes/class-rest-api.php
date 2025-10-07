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
        // Add 'blocks' field to pages (only in view context, not edit)
        register_rest_field('page', 'blocks', [
            'get_callback' => [__CLASS__, 'get_blocks'],
            'schema' => [
                'description' => __('Parsed Gutenberg blocks', 'dapflow-blocks'),
                'type' => 'array',
                'context' => ['view'], // Only in view context, not edit
            ],
        ]);
        
        // Add 'blocks' field to posts (only in view context, not edit)
        register_rest_field('post', 'blocks', [
            'get_callback' => [__CLASS__, 'get_blocks'],
            'schema' => [
                'description' => __('Parsed Gutenberg blocks', 'dapflow-blocks'),
                'type' => 'array',
                'context' => ['view'], // Only in view context, not edit
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
        try {
            $content = get_post_field('post_content', $object['id']);
            
            if (empty($content)) {
                return [];
            }
            
            $blocks = parse_blocks($content);
            
            if (!is_array($blocks)) {
                return [];
            }
            
            return self::process_blocks($blocks);
        } catch (Exception $e) {
            error_log('DapFlow Blocks REST API Error: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Process blocks recursively
     * 
     * @param array $blocks Raw blocks from parse_blocks()
     * @return array Processed blocks
     */
    private static function process_blocks($blocks) {
        if (!is_array($blocks)) {
            return [];
        }
        
        $processed = [];
        
        foreach ($blocks as $block) {
            try {
                // Skip empty/null blocks
                if (empty($block['blockName'])) {
                    continue;
                }
                
                // Ensure attrs is always an object, never an empty array
                $attrs = isset($block['attrs']) && is_array($block['attrs']) && !empty($block['attrs']) 
                    ? $block['attrs'] 
                    : new stdClass(); // Empty object, not empty array
                
                $processed_block = [
                    'blockName' => $block['blockName'],
                    'attrs' => $attrs,
                    'innerHTML' => isset($block['innerHTML']) ? $block['innerHTML'] : '',
                ];
                
                // Process inner blocks recursively
                if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                    $processed_block['innerBlocks'] = self::process_blocks($block['innerBlocks']);
                }
                
                // Add block-specific processing (skip if causes errors)
                try {
                    $processed_block = self::process_block_attrs($processed_block);
                } catch (Exception $e) {
                    error_log('DapFlow Blocks: Error processing attrs for ' . $block['blockName'] . ': ' . $e->getMessage());
                }
                
                $processed[] = $processed_block;
            } catch (Exception $e) {
                error_log('DapFlow Blocks: Error processing block: ' . $e->getMessage());
                continue;
            }
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
        // Convert attrs to array if it's an object
        if (is_object($block['attrs'])) {
            $block['attrs'] = (array)$block['attrs'];
        }
        
        // Clean up empty attributes (only if array)
        if (is_array($block['attrs'])) {
            $block['attrs'] = array_filter($block['attrs'], function($value) {
                return $value !== null && $value !== '';
            });
        }
        
        // Block-specific processing
        switch ($block['blockName']) {
            case 'dapflow/hero':
                if (is_array($block['attrs'])) {
                    $block['attrs'] = self::process_hero_attrs($block['attrs']);
                }
                break;
            
            case 'dapflow/cta':
                if (is_array($block['attrs'])) {
                    $block['attrs'] = self::process_cta_attrs($block['attrs']);
                }
                break;
            
            case 'dapflow/features':
                if (is_array($block['attrs'])) {
                    $block['attrs'] = self::process_features_attrs($block['attrs']);
                }
                break;
        }
        
        // Convert back to object for JSON if empty
        if (is_array($block['attrs']) && empty($block['attrs'])) {
            $block['attrs'] = new stdClass();
        }
        
        return $block;
    }
    
    /**
     * Process Hero block attributes
     */
    private static function process_hero_attrs($attrs) {
        // Combine CTA text and href into objects (with defaults)
        if (isset($attrs['primaryCtaText']) && !empty($attrs['primaryCtaText'])) {
            $attrs['primaryCta'] = [
                'text' => $attrs['primaryCtaText'],
                'href' => isset($attrs['primaryCtaHref']) && !empty($attrs['primaryCtaHref']) 
                    ? $attrs['primaryCtaHref'] 
                    : '#',
            ];
            unset($attrs['primaryCtaText'], $attrs['primaryCtaHref']);
        }
        
        if (isset($attrs['secondaryCtaText']) && !empty($attrs['secondaryCtaText'])) {
            $attrs['secondaryCta'] = [
                'text' => $attrs['secondaryCtaText'],
                'href' => isset($attrs['secondaryCtaHref']) && !empty($attrs['secondaryCtaHref'])
                    ? $attrs['secondaryCtaHref']
                    : '#',
            ];
            unset($attrs['secondaryCtaText'], $attrs['secondaryCtaHref']);
        }
        
        if (isset($attrs['badgeText']) && !empty($attrs['badgeText'])) {
            $attrs['badge'] = [
                'text' => $attrs['badgeText'],
                'linkText' => isset($attrs['badgeLinkText']) ? $attrs['badgeLinkText'] : '',
                'linkHref' => isset($attrs['badgeLinkHref']) && !empty($attrs['badgeLinkHref'])
                    ? $attrs['badgeLinkHref']
                    : '#',
            ];
            unset($attrs['badgeText'], $attrs['badgeLinkText'], $attrs['badgeLinkHref']);
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

