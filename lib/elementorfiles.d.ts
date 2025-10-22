// elementorfiles.d.ts
// Type definitions for Elementor files API in Headless CMS

export interface ElementorFileResponse {
  id: number;
  body_classes: string;
  js_files_api: ElementorJSFilesAPI;
  css_files_api: ElementorCSSFilesAPI;
}

export interface ElementorCSSFilesAPI {
  id: number;
  page_url: string;
  count: number;
  css_files: string[];
}

export interface ElementorJSFilesAPI {
  id: number;
  page_url: string;
  count: number;
  js_files: string[];
}

// Optional unified structure if you want to normalize data in frontend
export interface ElementorAssets {
  id: number;
  pageUrl: string;
  bodyClasses: string;
  cssFiles: string[];
  jsFiles: string[];
}
