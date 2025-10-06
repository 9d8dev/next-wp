import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/hero-basic', {
    edit: Edit,
    save: () => null,
});

