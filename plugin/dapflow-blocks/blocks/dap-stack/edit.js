/**
 * DapFlow Stack Block - Editor Component
 * 
 * Vertical stacking of blocks with responsive spacing
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
  __experimentalUnitControl as UnitControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { gap, align, maxWidth } = attributes;

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
    className: 'dap-stack-block',
    style: {
      maxWidth: maxWidth,
      margin: '0 auto',
      padding: '0 1.5rem'
    }
  });

  // Inner blocks props
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: `dap-stack flex flex-col ${gap.mobile} md:${gap.tablet} lg:${gap.desktop} items-${align}`,
    },
    {
      allowedBlocks: ['*'],
      template: [
        ['dap/box', {}],
        ['dap/box', {}],
        ['dap/box', {}]
      ]
    }
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Stack Settings', 'dapflow-blocks')} initialOpen={true}>
          <SelectControl
            label={__('Item Alignment', 'dapflow-blocks')}
            value={align}
            options={[
              { label: 'Stretch', value: 'stretch' },
              { label: 'Start', value: 'start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'end' }
            ]}
            onChange={(value) => setAttributes({ align: value })}
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
