import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    
    // Debug: Log attributes to console
    console.log('Hero Basic attributes:', attributes);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Hero Content" initialOpen={true}>
                    <TextControl
                        label="Title"
                        value={attributes.title}
                        onChange={(title) => setAttributes({ title })}
                    />
                    <TextareaControl
                        label="Subtitle"
                        value={attributes.subtitle}
                        onChange={(subtitle) => setAttributes({ subtitle })}
                    />
                </PanelBody>

                <PanelBody title="Call to Actions" initialOpen={false}>
                    <TextControl
                        label="Primary Button Text"
                        value={attributes.primaryCtaText}
                        onChange={(primaryCtaText) => setAttributes({ primaryCtaText })}
                    />
                    <TextControl
                        label="Primary Button Link"
                        value={attributes.primaryCtaHref}
                        onChange={(primaryCtaHref) => setAttributes({ primaryCtaHref })}
                        type="url"
                    />
                    <TextControl
                        label="Secondary Button Text"
                        value={attributes.secondaryCtaText}
                        onChange={(secondaryCtaText) => setAttributes({ secondaryCtaText })}
                    />
                    <TextControl
                        label="Secondary Button Link"
                        value={attributes.secondaryCtaHref}
                        onChange={(secondaryCtaHref) => setAttributes({ secondaryCtaHref })}
                        type="url"
                    />
                </PanelBody>

                <PanelBody title="Styling" initialOpen={false}>
                    <SelectControl
                        label="Background Color"
                        value={attributes.bgColor}
                        options={[
                            { label: 'Dark (Gray 900)', value: 'bg-gray-900' },
                            { label: 'Black', value: 'bg-black' },
                            { label: 'Primary', value: 'bg-primary' },
                        ]}
                        onChange={(bgColor) => setAttributes({ bgColor })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div style={{
                    background: '#1f2937',
                    color: 'white',
                    padding: '60px 40px',
                    textAlign: 'center',
                    borderRadius: '8px'
                }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
                        {attributes.title}
                    </h1>
                    <p style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                        {attributes.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        {attributes.primaryCtaText && (
                            <div style={{
                                padding: '12px 24px',
                                background: '#6366f1',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: '600'
                            }}>
                                {attributes.primaryCtaText}
                            </div>
                        )}
                        {attributes.secondaryCtaText && (
                            <div style={{ fontWeight: '600' }}>
                                {attributes.secondaryCtaText} →
                            </div>
                        )}
                    </div>
                    <p style={{
                        marginTop: '32px',
                        padding: '16px',
                        background: '#374151',
                        fontSize: '13px',
                        borderRadius: '6px'
                    }}>
                        💡 Edit hero content, CTAs, and colors in the sidebar →
                    </p>
                </div>
            </div>
        </>
    );
}

