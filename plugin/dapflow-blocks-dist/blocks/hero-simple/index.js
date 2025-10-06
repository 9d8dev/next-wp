import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/hero-simple', {
    edit: Edit,
    save: () => null,
});

