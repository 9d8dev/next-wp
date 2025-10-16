/**
 * DapFlow Box Block - Editor Component
 * 
 * Flexible container with variants for cards, content boxes, and sections
 */

import { __ } from '@wordpress/i18n';
import { 
  useBlockProps, 
  InspectorControls,
  useInnerBlocksProps
} from '@wordpress/block-editor';
import { 
  PanelBody, 
  SelectControl,
  ToggleControl,
  ColorPalette
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { variant, padding, bgColor, borderRadius, border, shadow } = attributes;

  // Update padding for specific breakpoint
  const updatePadding = (breakpoint, value) => {
    setAttributes({
      padding: {
        ...padding,
        [breakpoint]: value
      }
    });
  };

  // Get variant classes
  const getVariantClasses = () => {
    const baseClasses = `${bgColor} ${borderRadius}`;
    
    switch (variant) {
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

  // Block props for the wrapper
  const blockProps = useBlockProps({
    className: 'dap-box-block',
  });

  // Inner blocks props
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: `dap-box ${getVariantClasses()} ${padding.mobile} md:${padding.tablet} lg:${padding.desktop}`,
    },
    {
      allowedBlocks: ['*'],
      template: [
        ['core/heading', { level: 3, content: 'Box Title' }],
        ['core/paragraph', { content: 'This is a box container. Add any content here.' }]
      ]
    }
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Box Settings', 'dapflow-blocks')} initialOpen={true}>
          <SelectControl
            label={__('Variant', 'dapflow-blocks')}
            value={variant}
            options={[
              { label: 'Default', value: 'default' },
              { label: 'Elevated', value: 'elevated' },
              { label: 'Bordered', value: 'bordered' },
              { label: 'Card', value: 'card' }
            ]}
            onChange={(value) => setAttributes({ variant: value })}
          />
        </PanelBody>

        <PanelBody title={__('Spacing', 'dapflow-blocks')} initialOpen={false}>
          <SelectControl
            label={__('Mobile Padding', 'dapflow-blocks')}
            value={padding.mobile}
            options={[
              { label: 'None', value: 'p-0' },
              { label: 'Small', value: 'p-2' },
              { label: 'Medium', value: 'p-4' },
              { label: 'Large', value: 'p-6' },
              { label: 'Extra Large', value: 'p-8' }
            ]}
            onChange={(value) => updatePadding('mobile', value)}
          />
          <SelectControl
            label={__('Tablet Padding', 'dapflow-blocks')}
            value={padding.tablet}
            options={[
              { label: 'None', value: 'p-0' },
              { label: 'Small', value: 'p-2' },
              { label: 'Medium', value: 'p-4' },
              { label: 'Large', value: 'p-6' },
              { label: 'Extra Large', value: 'p-8' }
            ]}
            onChange={(value) => updatePadding('tablet', value)}
          />
          <SelectControl
            label={__('Desktop Padding', 'dapflow-blocks')}
            value={padding.desktop}
            options={[
              { label: 'None', value: 'p-0' },
              { label: 'Small', value: 'p-2' },
              { label: 'Medium', value: 'p-4' },
              { label: 'Large', value: 'p-6' },
              { label: 'Extra Large', value: 'p-8' }
            ]}
            onChange={(value) => updatePadding('desktop', value)}
          />
        </PanelBody>

        <PanelBody title={__('Appearance', 'dapflow-blocks')} initialOpen={false}>
          <SelectControl
            label={__('Background Color', 'dapflow-blocks')}
            value={bgColor}
            options={[
              { label: 'Transparent', value: 'bg-transparent' },
              { label: 'White', value: 'bg-white' },
              { label: 'Gray 50', value: 'bg-gray-50' },
              { label: 'Gray 100', value: 'bg-gray-100' },
              { label: 'Blue 50', value: 'bg-blue-50' },
              { label: 'Green 50', value: 'bg-green-50' }
            ]}
            onChange={(value) => setAttributes({ bgColor: value })}
          />
          
          <SelectControl
            label={__('Border Radius', 'dapflow-blocks')}
            value={borderRadius}
            options={[
              { label: 'None', value: 'rounded-none' },
              { label: 'Small', value: 'rounded-sm' },
              { label: 'Medium', value: 'rounded-md' },
              { label: 'Large', value: 'rounded-lg' },
              { label: 'Extra Large', value: 'rounded-xl' },
              { label: 'Full', value: 'rounded-full' }
            ]}
            onChange={(value) => setAttributes({ borderRadius: value })}
          />

          <SelectControl
            label={__('Shadow', 'dapflow-blocks')}
            value={shadow}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Small', value: 'shadow-sm' },
              { label: 'Medium', value: 'shadow-md' },
              { label: 'Large', value: 'shadow-lg' },
              { label: 'Extra Large', value: 'shadow-xl' }
            ]}
            onChange={(value) => setAttributes({ shadow: value })}
          />

          <ToggleControl
            label={__('Show Border', 'dapflow-blocks')}
            checked={border}
            onChange={(value) => setAttributes({ border: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div {...innerBlocksProps} />
      </div>
    </>
  );
}
