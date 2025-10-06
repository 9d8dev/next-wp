# TASK-001: WordPress Plugin Foundation

**Task ID**: TASK-001  
**Task Name**: Build WordPress Plugin Foundation (dapflow-blocks)  
**Priority**: P0 (Critical)  
**Status**: In Progress  
**Created**: October 6, 2025  
**Assignee**: AI Assistant  
**Estimated Time**: 2 days  

---

## Objective

Create the foundational WordPress plugin infrastructure for custom Gutenberg blocks that will integrate with the Next.js frontend.

---

## Context

This is the first phase of implementing the Gutenberg Block System (see ADR-2025-001). The plugin will:
- Register custom blocks in WordPress
- Extend REST API to expose block data as JSON
- Provide build system for block development
- Serve as foundation for all future blocks

---

## Requirements

### Must Have
- [x] Plugin main file with proper headers
- [ ] REST API extension for block data
- [ ] Block registry class
- [ ] Build system (webpack + babel)
- [ ] Block template for rapid development
- [ ] Plugin activation/deactivation hooks

### Should Have
- [ ] Block category "DapFlow"
- [ ] Admin settings page
- [ ] Development/production build modes
- [ ] Block validation system

### Nice to Have
- [ ] Block generator CLI tool
- [ ] Admin dashboard widget
- [ ] Block usage analytics

---

## Implementation Details

### File Structure

```
/plugin/dapflow-blocks/
├── dapflow-blocks.php              # Main plugin file
├── includes/
│   ├── class-block-registry.php    # Registers blocks
│   ├── class-rest-api.php          # REST API extension
│   ├── class-admin.php             # Admin interface
│   └── class-validator.php         # Block validation
├── blocks/
│   └── _template/                  # Template for new blocks
│       ├── block.json
│       ├── edit.js
│       ├── index.js
│       └── style.scss
├── src/                            # Source files
│   └── index.js                    # Entry point
├── build/                          # Compiled assets
├── assets/
│   ├── css/
│   └── js/
├── package.json
├── webpack.config.js
├── babel.config.js
├── .gitignore
└── README.md
```

### Main Plugin File

**Location**: `/plugin/dapflow-blocks/dapflow-blocks.php`

```php
<?php
/**
 * Plugin Name: DapFlow Blocks
 * Plugin URI: https://dapflow.com
 * Description: Custom Gutenberg blocks for DapFlow marketing pages
 * Version: 1.0.0
 * Author: DapFlow Team
 * Author URI: https://dapflow.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dapflow-blocks
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DAPFLOW_BLOCKS_VERSION', '1.0.0');
define('DAPFLOW_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('DAPFLOW_BLOCKS_URL', plugin_dir_url(__FILE__));

// Autoload classes
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-block-registry.php';
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-rest-api.php';
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-admin.php';
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-validator.php';

// Initialize plugin
function dapflow_blocks_init() {
    // Register blocks
    DapFlow_Block_Registry::init();
    
    // Extend REST API
    DapFlow_REST_API::init();
    
    // Admin interface
    if (is_admin()) {
        DapFlow_Admin::init();
    }
}
add_action('plugins_loaded', 'dapflow_blocks_init');

// Activation hook
register_activation_hook(__FILE__, 'dapflow_blocks_activate');
function dapflow_blocks_activate() {
    // Set default options
    add_option('dapflow_blocks_version', DAPFLOW_BLOCKS_VERSION);
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'dapflow_blocks_deactivate');
function dapflow_blocks_deactivate() {
    // Cleanup
    flush_rewrite_rules();
}
```

### REST API Extension

**Location**: `/plugin/dapflow-blocks/includes/class-rest-api.php`

```php
<?php
class DapFlow_REST_API {
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_fields']);
    }
    
    public static function register_fields() {
        // Add 'blocks' field to pages
        register_rest_field('page', 'blocks', [
            'get_callback' => [__CLASS__, 'get_blocks'],
            'schema' => [
                'description' => 'Parsed Gutenberg blocks',
                'type' => 'array',
            ],
        ]);
        
        // Add 'blocks' field to posts (optional)
        register_rest_field('post', 'blocks', [
            'get_callback' => [__CLASS__, 'get_blocks'],
            'schema' => [
                'description' => 'Parsed Gutenberg blocks',
                'type' => 'array',
            ],
        ]);
    }
    
    public static function get_blocks($object) {
        $content = get_post_field('post_content', $object['id']);
        $blocks = parse_blocks($content);
        
        return self::process_blocks($blocks);
    }
    
    private static function process_blocks($blocks) {
        $processed = [];
        
        foreach ($blocks as $block) {
            // Skip empty blocks
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
            
            $processed[] = $processed_block;
        }
        
        return $processed;
    }
}
```

### Block Registry

**Location**: `/plugin/dapflow-blocks/includes/class-block-registry.php`

```php
<?php
class DapFlow_Block_Registry {
    private static $blocks = [];
    
    public static function init() {
        add_action('init', [__CLASS__, 'register_block_category']);
        add_action('init', [__CLASS__, 'register_blocks']);
        add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_editor_assets']);
    }
    
    public static function register_block_category($categories) {
        return array_merge(
            [
                [
                    'slug' => 'dapflow',
                    'title' => __('DapFlow Blocks', 'dapflow-blocks'),
                    'icon' => 'layout',
                ],
            ],
            $categories
        );
    }
    
    public static function register_blocks() {
        // Auto-discover blocks in blocks/ directory
        $blocks_dir = DAPFLOW_BLOCKS_PATH . 'blocks/';
        
        if (!is_dir($blocks_dir)) {
            return;
        }
        
        $blocks = glob($blocks_dir . '*/block.json');
        
        foreach ($blocks as $block_json) {
            $block_dir = dirname($block_json);
            register_block_type($block_dir);
            
            $block_name = basename($block_dir);
            self::$blocks[] = 'dapflow/' . $block_name;
        }
    }
    
    public static function enqueue_editor_assets() {
        // Enqueue compiled block editor scripts
        $asset_file = DAPFLOW_BLOCKS_PATH . 'build/index.asset.php';
        
        if (file_exists($asset_file)) {
            $asset = require $asset_file;
            
            wp_enqueue_script(
                'dapflow-blocks-editor',
                DAPFLOW_BLOCKS_URL . 'build/index.js',
                $asset['dependencies'],
                $asset['version'],
                true
            );
            
            wp_enqueue_style(
                'dapflow-blocks-editor',
                DAPFLOW_BLOCKS_URL . 'build/index.css',
                [],
                $asset['version']
            );
        }
    }
    
    public static function get_registered_blocks() {
        return self::$blocks;
    }
}
```

### Build Configuration

**Location**: `/plugin/dapflow-blocks/webpack.config.js`

```javascript
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
};
```

**Location**: `/plugin/dapflow-blocks/package.json`

```json
{
  "name": "dapflow-blocks",
  "version": "1.0.0",
  "description": "Custom Gutenberg blocks for DapFlow",
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint": "wp-scripts lint-js"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0"
  },
  "dependencies": {
    "@wordpress/blocks": "^12.0.0",
    "@wordpress/block-editor": "^12.0.0",
    "@wordpress/components": "^25.0.0",
    "@wordpress/i18n": "^4.0.0",
    "@wordpress/element": "^5.0.0"
  }
}
```

### Block Template

**Location**: `/plugin/dapflow-blocks/blocks/_template/block.json`

```json
{
  "apiVersion": 3,
  "name": "dapflow/template",
  "title": "Template Block",
  "category": "dapflow",
  "icon": "layout",
  "description": "Template for new blocks",
  "keywords": ["template"],
  "supports": {
    "html": false,
    "align": ["wide", "full"]
  },
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./style.css"
}
```

**Location**: `/plugin/dapflow-blocks/blocks/_template/edit.js`

```jsx
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <TextControl
                        label="Title"
                        value={attributes.title}
                        onChange={(title) => setAttributes({ title })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div>
                <h3>{attributes.title || 'Enter title...'}</h3>
            </div>
        </>
    );
}
```

**Location**: `/plugin/dapflow-blocks/blocks/_template/index.js`

```jsx
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/template', {
    edit: Edit,
    save: () => null, // Dynamic block, rendered in Next.js
});
```

---

## Dependencies

### System Requirements
- WordPress 6.0+
- PHP 8.0+
- Node.js 18+
- npm or pnpm

### WordPress Dependencies
- Gutenberg (built into WordPress 5.0+)
- REST API (built into WordPress 4.7+)

### Node Dependencies
- @wordpress/scripts
- @wordpress/blocks
- @wordpress/block-editor
- @wordpress/components

---

## Testing Checklist

- [ ] Plugin activates without errors
- [ ] Plugin deactivates cleanly
- [ ] REST API returns blocks field
- [ ] Block category appears in editor
- [ ] Build process completes successfully
- [ ] No console errors in editor
- [ ] No PHP errors in debug.log

---

## Acceptance Criteria

1. ✅ Plugin file structure created
2. ✅ REST API extension working
3. ✅ Block registry functioning
4. ✅ Build system configured
5. ✅ Template block available
6. ✅ No errors on activation
7. ✅ Documentation complete

---

## Related Tasks

- TASK-002: Next.js Block Renderer
- TASK-003: Hero Block Implementation
- TASK-009: Block Generator CLI

---

## Related Documentation

- [ADR-2025-001](../decisions/ADR-2025-001-gutenberg-block-system.md)
- [Feature Spec: Gutenberg Blocks](../features/gutenberg_blocks.md)

---

## Notes

- Keep plugin lightweight
- Follow WordPress coding standards
- Use modern PHP practices (namespaces, type hints)
- Ensure backward compatibility with existing content
- All blocks save as `null` (dynamic rendering in Next.js)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-06 | AI Assistant | Initial task created |

