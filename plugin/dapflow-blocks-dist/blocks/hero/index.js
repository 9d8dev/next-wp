import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/hero', {
    edit: Edit,
    // Save returns null because we render dynamically in Next.js
    save: () => null,
});

