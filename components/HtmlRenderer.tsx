import React from 'react';
import {parseHtmlToComponents} from '@/lib/html-parser/utils';

interface HtmlRendererProps {
    htmlContent: string;
    className?: string;
    fallback?: React.ReactNode;
    debug?: boolean;
}

/**
 * HtmlRenderer Component (Server Component)
 *
 * Converts WordPress API HTML content to React components
 * Parsing happens server-side during render
 *
 * Usage:
 * ```tsx
 * <HtmlRenderer
 *   htmlContent={pageData.content}
 *   className="page-content"
 *   debug={true}  // Enable debug mode to see errors
 * />
 * ```
 */
export default function HtmlRenderer({
                                         htmlContent,
                                         className = '',
                                         fallback = <div>Unable to render content</div>,
                                         debug = false,
                                     }: HtmlRendererProps) {
    if (!htmlContent) {
        if (debug) console.warn('HtmlRenderer: No htmlContent provided');
        return <>{fallback}</>;
    }

    try {
        const parsedContent = parseHtmlToComponents(htmlContent);

        if (!parsedContent) {
            if (debug) console.warn('HtmlRenderer: Parser returned null');
            return <>{fallback}</>;
        }

        if (debug) console.log('HtmlRenderer: Successfully parsed content');

        return (
            <div className={className}>
                {parsedContent}
            </div>
        );
    } catch (error) {
        console.error('HtmlRenderer: Failed to parse HTML content:', error);
        if (debug) {
            console.error('HtmlRenderer: Input HTML:', htmlContent);
        }
        return <>{fallback}</>;
    }
}