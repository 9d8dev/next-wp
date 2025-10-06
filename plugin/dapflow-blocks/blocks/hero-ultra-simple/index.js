import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/hero-ultra-simple', {
    edit: Edit,
    save: () => null,
});

