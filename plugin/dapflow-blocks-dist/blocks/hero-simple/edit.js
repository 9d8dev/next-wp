import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Hero Settings">
                    <TextControl
                        label="Title"
                        value={attributes.title}
                        onChange={(title) => setAttributes({ title })}
                    />
                    <TextControl
                        label="Subtitle"
                        value={attributes.subtitle}
                        onChange={(subtitle) => setAttributes({ subtitle })}
                    />
                    <TextControl
                        label="Button Text"
                        value={attributes.buttonText}
                        onChange={(buttonText) => setAttributes({ buttonText })}
                    />
                    <TextControl
                        label="Button URL"
                        value={attributes.buttonUrl}
                        onChange={(buttonUrl) => setAttributes({ buttonUrl })}
                        type="url"
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div style={{
                    border: '2px dashed #ccc',
                    padding: '40px',
                    textAlign: 'center',
                    background: '#f9f9f9',
                    borderRadius: '8px'
                }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
                        {attributes.title}
                    </h1>
                    <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
                        {attributes.subtitle}
                    </p>
                    <button style={{
                        padding: '12px 24px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}>
                        {attributes.buttonText}
                    </button>
                    <p style={{
                        marginTop: '20px',
                        padding: '12px',
                        background: '#fff',
                        fontSize: '13px',
                        color: '#666'
                    }}>
                        💡 Edit content in the sidebar →
                    </p>
                </div>
            </div>
        </>
    );
}

