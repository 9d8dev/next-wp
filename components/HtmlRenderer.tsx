'use client';

import React, {useEffect, useState} from 'react';
import {parseHtmlToComponents} from '@/lib/html-parser/utils';

interface HtmlRendererProps {
    htmlContent: string;
    className?: string;
    fallback?: React.ReactNode;
    debug?: boolean;
}

/**
 * HtmlRenderer Component
 *
 * Converts WordPress API HTML content to React components
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
    const [parsedContent, setParsedContent] = useState<React.ReactNode>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!htmlContent) {
            if (debug) console.warn('HtmlRenderer: No htmlContent provided');
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        (async () => {
            try {
                const result = await parseHtmlToComponents(htmlContent);

                if (!result) {
                    if (debug) console.warn('HtmlRenderer: Parser returned null');
                    isMounted && setParsedContent(null);
                } else {
                    if (debug) console.log('HtmlRenderer: Successfully parsed content');
                    isMounted && setParsedContent(result);
                }
            } catch (error) {
                console.error('HtmlRenderer: Failed to parse HTML content:', error);
                if (debug) {
                    console.error('HtmlRenderer: Input HTML:', htmlContent);
                }
                isMounted && setParsedContent(null);
            } finally {
                isMounted && setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [htmlContent, debug]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!parsedContent) {
        return <>{fallback}</>;
    }

    return (
        <div className={className}>
            {parsedContent}
        </div>
    );
}