import {ComponentType} from 'react';
import {blockquoteMapping} from "@/components/blocks/Blockquote";
import {ParagraphMapping} from "@/components/blocks/Paragraph";
import {GalleryMapping} from "@/components/blocks/Gallery";
import {imageTagMapping} from "@/components/blocks/Image";
import {AnchorTagMapping} from "@/components/blocks/AnchorTag";

export interface ComponentMapping {
    selector: string; // CSS selector like ".wp-block-quote" or "p" or ".my-class"
    component: ComponentType<any>;
    extractProps?: (element: any) => Record<string, any>;
}

/**
 * Define your custom component mappings here
 * className: the WordPress block class name to match
 * component: the React component to render
 * extractProps: optional function to extract props from the HTML element's data attributes or children
 */
export const componentMappings: ComponentMapping[] = [
    blockquoteMapping,
    ParagraphMapping,
    AnchorTagMapping,
    GalleryMapping,
    imageTagMapping,
];