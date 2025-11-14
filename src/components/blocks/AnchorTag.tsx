interface AnchorTagProps {
    href?: string;
    children?: React.ReactNode;
    className?: string;
    title?: string;
    target?: string;
    rel?: string;
}

export default function AnchorTag({
                                      href = '#',
                                      children,
                                      className = '',
                                      title,
                                      target,
                                      rel,
                                  }: AnchorTagProps) {
    return (
        <a
            href={href}
            title={title}
            target={target}
            rel={rel}
            className={`text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors ${className}`}
        >
            {children}
        </a>
    );
}

export const AnchorTagMapping = {
    selector: 'a',
    component: AnchorTag,
    extractProps: (node: any) => ({
        href: node.properties?.href || '#',
        title: node.properties?.title || '',
        target: node.properties?.target || '',
        rel: node.properties?.rel || '',
    }),
}