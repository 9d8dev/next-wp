import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <div style={{ padding: '20px', border: '1px solid #ccc', width: '100%' }}>
                <TextControl
                    label="Content"
                    value={attributes.content}
                    onChange={(content) => setAttributes({ content })}
                />
                <p>Preview: {attributes.content}</p>
            </div>
        </div>
    );
}

