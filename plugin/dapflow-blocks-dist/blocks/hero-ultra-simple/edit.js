import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    return (
        <div {...useBlockProps()}>
            <TextControl
                label="Title"
                value={attributes.title || ''}
                onChange={(title) => setAttributes({ title })}
            />
            <TextControl
                label="Subtitle"
                value={attributes.subtitle || ''}
                onChange={(subtitle) => setAttributes({ subtitle })}
            />
            <div style={{padding: '20px', background: '#f0f0f0', marginTop: '10px'}}>
                <h2>{attributes.title || 'Enter title...'}</h2>
                <p>{attributes.subtitle || 'Enter subtitle...'}</p>
            </div>
        </div>
    );
}

