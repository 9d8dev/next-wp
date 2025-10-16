/**
 * DapFlow Box Block
 * 
 * Registers the box block
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: () => null, // Save handled by inner blocks
});
