import Blockquote from "@/components/blocks/Blockquote";

interface ParagraphProps {
    children?: React.ReactNode;
    className?: string;
}

export default function Paragraph({ children, className = '' }: ParagraphProps) {
    return (
        <p className={`text-base leading-relaxed text-gray-800 mb-4 ${className}`}>
            {children}
        </p>
    );
}

export const ParagraphMapping = {
    selector: '.wp-block-quote',
    component: Blockquote,
    extractProps: () => ({}),
}