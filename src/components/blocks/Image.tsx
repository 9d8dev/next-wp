import Image from "next/image"

interface ImageTagProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    children?: React.ReactNode;
}

export default function ImageTag({
                                     src = '',
                                     alt = '',
                                     width,
                                     height,
                                     className = '',
                                     children,
                                 }: ImageTagProps) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 600}
            loading="lazy"
            className={`w-full h-auto object-cover ${className}`}
        />
    )
}

export const imageTagMapping = {
    selector: 'img',
    component: ImageTag,
    extractProps: (node: any) => ({
        src: node.properties?.src || '',
        alt: node.properties?.alt || '',
        width: node.properties?.width ? parseInt(String(node.properties.width)) : 800,
        height: node.properties?.height ? parseInt(String(node.properties.height)) : 600,
    }),
}