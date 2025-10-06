#!/usr/bin/env node

/**
 * DapFlow Block Generator CLI
 * 
 * Generates a new Gutenberg block with all necessary files:
 * - WordPress block files (block.json, edit.js, index.js, style.scss)
 * - Next.js component (components/blocks/BlockName.tsx)
 * - TypeScript types (lib/blocks/types.ts)
 * - Registry updates (lib/blocks/block-registry.ts)
 * - Plugin entry update (plugin/dapflow-blocks/src/index.js)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility functions
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// Template generators
function generateBlockJson(config) {
  const attributes = {};
  config.attributes.forEach(attr => {
    attributes[attr.name] = {
      type: attr.type,
      default: attr.default
    };
  });

  return JSON.stringify({
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": `dapflow/${config.blockName}`,
    "title": config.blockTitle,
    "category": "dapflow",
    "icon": config.icon,
    "description": config.description,
    "keywords": config.keywords,
    "supports": {
      "html": false,
      "align": ["wide", "full"],
      "anchor": true
    },
    "attributes": attributes,
    "editorScript": "file:./index.js",
    "editorStyle": "file:./style.css"
  }, null, 2);
}

function generateEditJs(config) {
  const pascalName = toPascalCase(config.blockName);
  const controls = config.attributes.map(attr => {
    const controlType = attr.type === 'boolean' ? 'ToggleControl' : 
                       attr.type === 'number' ? 'TextControl' : 'TextControl';
    
    if (attr.type === 'boolean') {
      return `          <ToggleControl
            label={__('${attr.label}', 'dapflow-blocks')}
            checked={attributes.${attr.name}}
            onChange={(value) => setAttributes({ ${attr.name}: value })}
          />`;
    } else {
      return `          <TextControl
            label={__('${attr.label}', 'dapflow-blocks')}
            value={attributes.${attr.name}}
            onChange={(value) => setAttributes({ ${attr.name}: value })}
            ${attr.type === 'url' ? 'type="url"' : ''}
          />`;
    }
  }).join('\n\n');

  const previewContent = config.attributes
    .filter(attr => attr.type === 'string' && !attr.name.includes('url') && !attr.name.includes('Url'))
    .map(attr => `        <p><strong>${attr.label}:</strong> {attributes.${attr.name}}</p>`)
    .join('\n');

  return `import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl,
    ToggleControl,
    Button
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('${config.blockTitle} Settings', 'dapflow-blocks')} initialOpen={true}>
${controls}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="dapflow-block-preview ${config.blockName}-preview">
                    <div className="${config.blockName}-content">
                        <h3>{attributes.title || '${config.blockTitle}'}</h3>
${previewContent}
                    </div>
                    
                    <p className="editor-note">
                        💡 <strong>Preview:</strong> Use the sidebar to customize this ${config.blockTitle.toLowerCase()}.
                        This will render with your design system on the frontend.
                    </p>
                </div>
            </div>
        </>
    );
}
`;
}

function generateIndexJs(config) {
  return `import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/${config.blockName}', {
    edit: Edit,
    // Save returns null because we render dynamically in Next.js
    save: () => null,
});
`;
}

function generateStyleScss(config) {
  const pascalName = toPascalCase(config.blockName);
  return `/**
 * ${pascalName} Block Editor Styles
 */

.wp-block-dapflow-${config.blockName} {
  .dapflow-block-preview {
    border: 2px dashed #e0e0e0;
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    background: #ffffff;
    
    &:hover {
      border-color: #6366f1;
    }
  }

  .${config.blockName}-preview {
    .${config.blockName}-content {
      padding: 40px;
      text-align: center;
      
      h3 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 16px 0;
      }
      
      p {
        margin: 8px 0;
        color: #6b7280;
      }
    }

    .editor-note {
      background: #f3f4f6;
      padding: 16px;
      margin: 0;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #6b7280;
      line-height: 1.5;
      
      strong {
        color: #374151;
      }
    }
  }
}
`;
}

function generateComponentTsx(config) {
  const pascalName = toPascalCase(config.blockName);
  
  const interfaceProps = config.attributes.map(attr => {
    const tsType = attr.type === 'boolean' ? 'boolean' : 
                   attr.type === 'number' ? 'number' : 'string';
    const optional = attr.default ? '?' : '';
    return `  ${attr.name}${optional}: ${tsType};`;
  }).join('\n');

  const componentProps = config.attributes.map(attr => {
    return `  ${attr.name}${attr.default ? ` = ${JSON.stringify(attr.default)}` : ''},`;
  }).join('\n');

  const renderContent = config.attributes
    .filter(attr => !attr.name.includes('color') && !attr.name.includes('Color'))
    .map(attr => {
      if (attr.name.toLowerCase().includes('title')) {
        return `        <h2>{${attr.name}}</h2>`;
      } else if (attr.name.toLowerCase().includes('subtitle') || attr.name.toLowerCase().includes('description')) {
        return `        <p>{${attr.name}}</p>`;
      } else if (attr.name.toLowerCase().includes('button') && !attr.name.toLowerCase().includes('url')) {
        const urlAttr = config.attributes.find(a => 
          a.name.toLowerCase().includes('url') || a.name.toLowerCase().includes('href')
        );
        if (urlAttr) {
          return `        <Button href={${urlAttr.name}}>{${attr.name}}</Button>`;
        }
        return `        <Button>{${attr.name}}</Button>`;
      }
      return null;
    })
    .filter(Boolean)
    .join('\n');

  return `import { Section, Container } from '@/components/craft';
import { Button } from '@/components/ui/button';

export interface ${pascalName}Props {
${interfaceProps}
}

export function ${pascalName}({
${componentProps}
}: ${pascalName}Props) {
  return (
    <Section>
      <Container>
${renderContent}
      </Container>
    </Section>
  );
}
`;
}

function generateTypeDefinition(config) {
  const pascalName = toPascalCase(config.blockName);
  
  const interfaceProps = config.attributes.map(attr => {
    const tsType = attr.type === 'boolean' ? 'boolean' : 
                   attr.type === 'number' ? 'number' : 'string';
    const optional = attr.default ? '?' : '';
    return `  ${attr.name}${optional}: ${tsType};`;
  }).join('\n');

  return `
// ${pascalName} Block
export interface ${pascalName}BlockAttributes {
${interfaceProps}
}
`;
}

// File operations
async function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function writeFile(filePath, content) {
  await ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Created: ${filePath}`);
}

function updateBlockRegistry(config) {
  const registryPath = path.join(process.cwd(), 'lib/blocks/block-registry.ts');
  const pascalName = toPascalCase(config.blockName);
  
  let content = fs.readFileSync(registryPath, 'utf8');
  
  // Add import
  const importLine = `import { ${pascalName} } from '@/components/blocks/${pascalName}';`;
  const importSection = content.match(/\/\/ Import block components[\s\S]*?(?=\n\n)/)[0];
  const newImportSection = importSection + `\n${importLine}`;
  content = content.replace(importSection, newImportSection);
  
  // Add to registry
  const registryMatch = content.match(/(export const BLOCK_COMPONENTS[^{]*{\s*)/);
  if (registryMatch) {
    const registryStart = registryMatch[0];
    const registryLine = `  'dapflow/${config.blockName}': ${pascalName},\n`;
    content = content.replace(registryStart, registryStart + registryLine);
  }
  
  fs.writeFileSync(registryPath, content, 'utf8');
  console.log(`✓ Updated: ${registryPath}`);
}

function updateTypes(config) {
  const typesPath = path.join(process.cwd(), 'lib/blocks/types.ts');
  let content = fs.readFileSync(typesPath, 'utf8');
  
  const typeDefinition = generateTypeDefinition(config);
  content = content.trimEnd() + '\n' + typeDefinition;
  
  fs.writeFileSync(typesPath, content, 'utf8');
  console.log(`✓ Updated: ${typesPath}`);
}

function updatePluginEntry(config) {
  const entryPath = path.join(process.cwd(), 'plugin/dapflow-blocks/src/index.js');
  let content = fs.readFileSync(entryPath, 'utf8');
  
  // Add import after other block imports
  const importLine = `import '../blocks/${config.blockName}/index.js';`;
  const importSection = content.match(/\/\/ Import block registrations[\s\S]*?(?=\n\nconsole)/)[0];
  const newImportSection = importSection + `\n${importLine}`;
  content = content.replace(importSection, newImportSection);
  
  fs.writeFileSync(entryPath, content, 'utf8');
  console.log(`✓ Updated: ${entryPath}`);
}

// Main CLI function
async function main() {
  console.log('\n🎨 DapFlow Block Generator\n');
  console.log('This tool will generate a new Gutenberg block with all necessary files.\n');

  try {
    // Collect block information
    const blockName = await prompt('Block name (kebab-case, e.g., "call-to-action"): ');
    const blockTitle = await prompt('Block title (e.g., "Call to Action"): ');
    const description = await prompt('Block description: ');
    const icon = await prompt('Block icon (dashicons name, e.g., "megaphone"): ');
    const keywordsInput = await prompt('Keywords (comma-separated): ');
    
    console.log('\n📝 Define block attributes (press Enter with empty name to finish):\n');
    
    const attributes = [];
    while (true) {
      const attrName = await prompt('  Attribute name (or press Enter to finish): ');
      if (!attrName) break;
      
      const attrLabel = await prompt('  Attribute label: ');
      const attrType = await prompt('  Attribute type (string/number/boolean/url): ');
      const attrDefault = await prompt('  Default value: ');
      
      attributes.push({
        name: attrName,
        label: attrLabel,
        type: attrType || 'string',
        default: attrType === 'boolean' ? (attrDefault === 'true') :
                 attrType === 'number' ? Number(attrDefault) :
                 attrDefault
      });
      
      console.log('  ✓ Attribute added\n');
    }

    const config = {
      blockName: toKebabCase(blockName),
      blockTitle,
      description,
      icon: icon || 'layout',
      keywords: keywordsInput.split(',').map(k => k.trim()),
      attributes
    };

    console.log('\n🔨 Generating files...\n');

    // Generate WordPress block files
    const blockDir = path.join(process.cwd(), 'plugin/dapflow-blocks/blocks', config.blockName);
    await writeFile(
      path.join(blockDir, 'block.json'),
      generateBlockJson(config)
    );
    await writeFile(
      path.join(blockDir, 'edit.js'),
      generateEditJs(config)
    );
    await writeFile(
      path.join(blockDir, 'index.js'),
      generateIndexJs(config)
    );
    await writeFile(
      path.join(blockDir, 'style.scss'),
      generateStyleScss(config)
    );

    // Generate Next.js component
    const pascalName = toPascalCase(config.blockName);
    await writeFile(
      path.join(process.cwd(), 'components/blocks', `${pascalName}.tsx`),
      generateComponentTsx(config)
    );

    // Update registry and types
    updateBlockRegistry(config);
    updateTypes(config);
    updatePluginEntry(config);

    console.log('\n🎉 Block generated successfully!\n');
    console.log('Next steps:');
    console.log('1. Customize the component: components/blocks/' + pascalName + '.tsx');
    console.log('2. Customize editor controls: plugin/dapflow-blocks/blocks/' + config.blockName + '/edit.js');
    console.log('3. Build plugin: cd plugin/dapflow-blocks && npm run build');
    console.log('4. Test in WordPress editor\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run CLI
main();

