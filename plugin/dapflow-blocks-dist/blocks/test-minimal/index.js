import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('dapflow/test-minimal', {
    edit: Edit,
    save: () => null,
});

