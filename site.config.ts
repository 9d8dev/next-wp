type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

const siteDomain = process.env.NEXT_PUBLIC_URL;

if (!siteDomain) {
  throw new Error("NEXT_PUBLIC_URL environment variable is not defined");
}

export const siteConfig: SiteConfig = {
  site_name: "Системный Блокъ",
  site_description: "Онлайн-журнал о влиянии цифровых технологий на культуру, человека и общество",
  site_domain: siteDomain,
};
