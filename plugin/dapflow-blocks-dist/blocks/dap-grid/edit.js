/**
 * DapFlow Grid Block - Editor Component
 * 
 * Responsive grid layout with customizable columns and spacing
 */

import { __ } from '@wordpress/i18n';
import { 
  useBlockProps, 
  InspectorControls,
  useInnerBlocksProps,
  store as blockEditorStore
} from '@wordpress/block-editor';
import { 
  PanelBody, 
  RangeControl, 
  SelectControl,
  __experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
  const { columns, gap, align, maxWidth } = attributes;

  // Update column count for specific breakpoint
  const updateColumns = (breakpoint, value) => {
    setAttributes({
      columns: {
        ...columns,
        [breakpoint]: value
      }
    });
  };

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
    className: 'dap-grid-block',
    style: {
      maxWidth: maxWidth,
      margin: '0 auto',
      padding: '0 1.5rem'
    }
  });

  // Inner blocks props
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: `dap-grid grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} ${gap.mobile} md:${gap.tablet} lg:${gap.desktop} items-${align}`,
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
        <PanelBody title={__('Grid Settings', 'dapflow-blocks')} initialOpen={true}>
          <RangeControl
            label={__('Mobile Columns', 'dapflow-blocks')}
            value={columns.mobile}
            onChange={(value) => updateColumns('mobile', value)}
            min={1}
            max={4}
          />
          <RangeControl
            label={__('Tablet Columns', 'dapflow-blocks')}
            value={columns.tablet}
            onChange={(value) => updateColumns('tablet', value)}
            min={1}
            max={6}
          />
          <RangeControl
            label={__('Desktop Columns', 'dapflow-blocks')}
            value={columns.desktop}
            onChange={(value) => updateColumns('desktop', value)}
            min={1}
            max={8}
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

        <PanelBody title={__('Alignment', 'dapflow-blocks')} initialOpen={false}>
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
