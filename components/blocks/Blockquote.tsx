interface BlockquoteProps {
    children?: React.ReactNode;
    className?: string;
}

export default function Blockquote({children, className = ''}: BlockquoteProps) {
    return (
        <blockquote
            className={`border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 bg-gray-50 ${className}`}>
            {children}
        </blockquote>
    );
}

export const blockquoteMapping = {
    selector: '.wp-block-quote',
    component: Blockquote,
    extractProps: () => ({}),
}