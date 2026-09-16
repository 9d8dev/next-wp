type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

export const siteConfig: SiteConfig = {
  site_name: "Fahrschule Bz Ucar",
  site_description: "Fahrschule Bz Ucar",
  site_domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
