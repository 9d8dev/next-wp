import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl, 
    TextareaControl,
    ToggleControl,
    SelectControl,
    Button
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    const {
        title,
        subtitle,
        primaryCtaText,
        primaryCtaHref,
        secondaryCtaText,
        secondaryCtaHref,
        badgeText,
        badgeLinkText,
        badgeLinkHref,
        bgColor,
        textColor,
        showDecorations,
        logoUrl,
        logoAlt,
    } = attributes;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Hero Content', 'dapflow-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('Title', 'dapflow-blocks')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        help={__('Main heading for the hero section', 'dapflow-blocks')}
                    />
                    
                    <TextareaControl
                        label={__('Subtitle', 'dapflow-blocks')}
                        value={subtitle}
                        onChange={(value) => setAttributes({ subtitle: value })}
                        help={__('Descriptive text below the title', 'dapflow-blocks')}
                        rows={3}
                    />
                </PanelBody>

                <PanelBody title={__('Call to Actions', 'dapflow-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Primary Button Text', 'dapflow-blocks')}
                        value={primaryCtaText}
                        onChange={(value) => setAttributes({ primaryCtaText: value })}
                    />
                    
                    <TextControl
                        label={__('Primary Button Link', 'dapflow-blocks')}
                        value={primaryCtaHref}
                        onChange={(value) => setAttributes({ primaryCtaHref: value })}
                        type="url"
                    />
                    
                    <hr style={{ margin: '20px 0' }} />
                    
                    <TextControl
                        label={__('Secondary Button Text', 'dapflow-blocks')}
                        value={secondaryCtaText}
                        onChange={(value) => setAttributes({ secondaryCtaText: value })}
                    />
                    
                    <TextControl
                        label={__('Secondary Button Link', 'dapflow-blocks')}
                        value={secondaryCtaHref}
                        onChange={(value) => setAttributes({ secondaryCtaHref: value })}
                        type="url"
                    />
                </PanelBody>

                <PanelBody title={__('Badge (Announcement)', 'dapflow-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Badge Text', 'dapflow-blocks')}
                        value={badgeText}
                        onChange={(value) => setAttributes({ badgeText: value })}
                        help={__('Announcement text (leave empty to hide)', 'dapflow-blocks')}
                    />
                    
                    <TextControl
                        label={__('Badge Link Text', 'dapflow-blocks')}
                        value={badgeLinkText}
                        onChange={(value) => setAttributes({ badgeLinkText: value })}
                    />
                    
                    <TextControl
                        label={__('Badge Link URL', 'dapflow-blocks')}
                        value={badgeLinkHref}
                        onChange={(value) => setAttributes({ badgeLinkHref: value })}
                        type="url"
                    />
                </PanelBody>

                <PanelBody title={__('Branding', 'dapflow-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Logo URL', 'dapflow-blocks')}
                        value={logoUrl}
                        onChange={(value) => setAttributes({ logoUrl: value })}
                        type="url"
                    />
                    
                    <TextControl
                        label={__('Logo Alt Text', 'dapflow-blocks')}
                        value={logoAlt}
                        onChange={(value) => setAttributes({ logoAlt: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Styling', 'dapflow-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Background Color', 'dapflow-blocks')}
                        value={bgColor}
                        options={[
                            { label: 'Dark (Gray 900)', value: 'bg-gray-900' },
                            { label: 'Primary', value: 'bg-primary' },
                            { label: 'Black', value: 'bg-black' },
                            { label: 'Slate 900', value: 'bg-slate-900' },
                            { label: 'Gradient (Primary to Accent)', value: 'bg-gradient-to-br from-primary to-accent' },
                        ]}
                        onChange={(value) => setAttributes({ bgColor: value })}
                    />
                    
                    <SelectControl
                        label={__('Text Color', 'dapflow-blocks')}
                        value={textColor}
                        options={[
                            { label: 'White', value: 'text-white' },
                            { label: 'Gray 100', value: 'text-gray-100' },
                            { label: 'Foreground', value: 'text-foreground' },
                        ]}
                        onChange={(value) => setAttributes({ textColor: value })}
                    />
                    
                    <ToggleControl
                        label={__('Show Background Decorations', 'dapflow-blocks')}
                        checked={showDecorations}
                        onChange={(value) => setAttributes({ showDecorations: value })}
                        help={__('Gradient blobs in the background', 'dapflow-blocks')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="dapflow-block-preview hero-preview">
                    <div className={`hero-content ${bgColor}`}>
                        {badgeText && (
                            <div className="hero-badge">
                                <span className="badge-text">{badgeText}</span>
                                {badgeLinkText && <span className="badge-link"> {badgeLinkText} →</span>}
                            </div>
                        )}
                        
                        <h1 className={`hero-title ${textColor}`}>{title}</h1>
                        <p className="hero-subtitle">{subtitle}</p>
                        
                        <div className="hero-ctas">
                            {primaryCtaText && (
                                <Button variant="primary" className="hero-cta-primary">
                                    {primaryCtaText}
                                </Button>
                            )}
                            {secondaryCtaText && (
                                <span className={`hero-cta-secondary ${textColor}`}>
                                    {secondaryCtaText} →
                                </span>
                            )}
                        </div>
                        
                        {showDecorations && (
                            <div className="hero-decorations">
                                <div className="decoration decoration-top"></div>
                                <div className="decoration decoration-bottom"></div>
                            </div>
                        )}
                    </div>
                    
                    <p className="editor-note">
                        💡 <strong>Preview:</strong> Use the sidebar on the right to customize content, CTAs, and styling.
                        This will render with your full design system on the frontend.
                    </p>
                </div>
            </div>
        </>
    );
}

