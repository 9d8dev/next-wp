interface GalleryProps {
    children?: React.ReactNode;
    className?: string;
}

export default function Gallery({ children, className = '' }: GalleryProps) {
    return (
        <figure className={`wp-block-gallery grid gap-4 my-6 ${className}`}>
            {children}
        </figure>
    );
}

export const GalleryMapping={
    selector: '.wp-block-gallery',
    component: Gallery,
    extractProps: () => ({}),
}