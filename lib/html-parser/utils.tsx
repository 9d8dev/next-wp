import {unified} from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import * as production from 'react/jsx-runtime';
import {componentMappings} from './config';
import {visit} from 'unist-util-visit';

/**
 * Parse a CSS selector and return type and value
 * ".classname" -> { type: 'class', value: 'classname' }
 * "tagname" -> { type: 'tag', value: 'tagname' }
 */
function parseSelector(selector: string) {
    if (selector.startsWith('.')) {
        return {type: 'class', value: selector.slice(1)};
    }
    return {type: 'tag', value: selector};
}

/**
 * Custom rehype plugin to transform elements by selector (class or tag)
 * Changes element tag name to component name so rehype-react can map it
 */
function rehypeComponentMapper() {
    return (tree: any) => {
        visit(tree, 'element', (node: any) => {
            const className = node.properties?.className;
            const tagName = node.tagName;

            // Try to find a matching component mapping
            for (const mapping of componentMappings) {
                const {type, value} = parseSelector(mapping.selector);

                let matches = false;

                if (type === 'class') {
                    // Match by class name
                    if (className) {
                        const classNames = Array.isArray(className) ? className : [className];
                        matches = classNames.includes(value);
                    }
                } else if (type === 'tag') {
                    // Match by tag name
                    matches = tagName === value;
                }

                if (matches) {
                    const props = mapping.extractProps ? mapping.extractProps(node) : {};
                    // Use selector as the new tag name for rehype-react to map
                    node.tagName = mapping.selector;
                    if (Object.keys(props).length > 0) {
                        node.properties._componentProps = props;
                    }
                    return;
                }
            }
        });
    };
}

/**
 * Build components map for rehype-react
 * Maps selector names to React components
 */
function buildComponentsMap() {
    const components: Record<string, any> = {};

    // Create a component for each mapping
    for (const mapping of componentMappings) {
        components[mapping.selector] = ({children, _componentProps = {}, ...props}: any) => {
            const Component = mapping.component;
            return (
                <Component {..._componentProps} {...props}>
                    {children}
                </Component>
            );
        };
    }

    return components;
}

/**
 * Main parser function - Asynchronous version
 * Converts HTML string to React components
 *
 * Usage:
 * ```tsx
 * const content = await parseHtmlToComponents(htmlString);
 * ```
 */
export async function parseHtmlToComponents(htmlString: string) {
    try {
        const componentsMap = buildComponentsMap();

        const file = await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeComponentMapper)
            .use(rehypeReact, {
                ...production,
                components: componentsMap,
            })
            .process(htmlString);

        return file.result;
    } catch (error) {
        console.error('Error parsing HTML:', error);
        return null;
    }
}