/**
 * DapFlow Row Block - Editor Component
 * 
 * Horizontal arrangement of blocks with responsive controls
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
  __experimentalUnitControl as UnitControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { gap, align, justify, wrap, maxWidth } = attributes;

  // Update gap for specific breakpoint
  const updateGap = (breakpoint, value) => {
    setAttributes({
      gap: {
        ...gap,
        [breakpoint]: value
      }
    });
  };

  // Block props for the wrapper
  const blockProps = useBlockProps({
    className: 'dap-row-block',
    style: {
      maxWidth: maxWidth,
      margin: '0 auto',
      padding: '0 1.5rem'
    }
  });

  // Inner blocks props
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: `dap-row flex ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${gap.mobile} md:${gap.tablet} lg:${gap.desktop} items-${align} justify-${justify}`,
    },
    {
      allowedBlocks: ['*'],
      template: [
        ['dap/box', {}],
        ['dap/box', {}]
      ]
    }
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Row Settings', 'dapflow-blocks')} initialOpen={true}>
          <SelectControl
            label={__('Item Alignment', 'dapflow-blocks')}
            value={align}
            options={[
              { label: 'Start', value: 'start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'end' },
              { label: 'Stretch', value: 'stretch' }
            ]}
            onChange={(value) => setAttributes({ align: value })}
          />
          
          <SelectControl
            label={__('Justify Content', 'dapflow-blocks')}
            value={justify}
            options={[
              { label: 'Start', value: 'start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'end' },
              { label: 'Space Between', value: 'between' },
              { label: 'Space Around', value: 'around' },
              { label: 'Space Evenly', value: 'evenly' }
            ]}
            onChange={(value) => setAttributes({ justify: value })}
          />

          <ToggleControl
            label={__('Wrap Items', 'dapflow-blocks')}
            checked={wrap}
            onChange={(value) => setAttributes({ wrap: value })}
          />
        </PanelBody>

        <PanelBody title={__('Spacing', 'dapflow-blocks')} initialOpen={false}>
          <SelectControl
            label={__('Mobile Gap', 'dapflow-blocks')}
            value={gap.mobile}
            options={[
              { label: 'None', value: 'gap-0' },
              { label: 'Small', value: 'gap-2' },
              { label: 'Medium', value: 'gap-4' },
              { label: 'Large', value: 'gap-6' },
              { label: 'Extra Large', value: 'gap-8' }
            ]}
            onChange={(value) => updateGap('mobile', value)}
          />
          <SelectControl
            label={__('Tablet Gap', 'dapflow-blocks')}
            value={gap.tablet}
            options={[
              { label: 'None', value: 'gap-0' },
              { label: 'Small', value: 'gap-2' },
              { label: 'Medium', value: 'gap-4' },
              { label: 'Large', value: 'gap-6' },
              { label: 'Extra Large', value: 'gap-8' }
            ]}
            onChange={(value) => updateGap('tablet', value)}
          />
          <SelectControl
            label={__('Desktop Gap', 'dapflow-blocks')}
            value={gap.desktop}
            options={[
              { label: 'None', value: 'gap-0' },
              { label: 'Small', value: 'gap-2' },
              { label: 'Medium', value: 'gap-4' },
              { label: 'Large', value: 'gap-6' },
              { label: 'Extra Large', value: 'gap-8' }
            ]}
            onChange={(value) => updateGap('desktop', value)}
          />
        </PanelBody>

        <PanelBody title={__('Container', 'dapflow-blocks')} initialOpen={false}>
          <UnitControl
            label={__('Max Width', 'dapflow-blocks')}
            value={maxWidth}
            onChange={(value) => setAttributes({ maxWidth: value })}
            units={[
              { value: 'px', label: 'px' },
              { value: 'rem', label: 'rem' },
              { value: '%', label: '%' }
            ]}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div {...innerBlocksProps} />
      </div>
    </>
  );
}
