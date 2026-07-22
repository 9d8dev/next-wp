// Site navigation, mirroring the menu on https://www.gujrera.com
export type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainMenu: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Gujarati Samaj", href: "/category/gujarati-samaj/" },
  { label: "GCAS", href: "/category/gcas/" },
  {
    label: "Projects",
    href: "/category/p/",
    children: [
      { label: "Ahmedabad", href: "/category/p/ahmedabad/" },
      { label: "Gandhinagar", href: "/category/p/gandhinagar/" },
      { label: "Surat", href: "/category/p/surat/" },
      { label: "Rajkot", href: "/category/p/rajkot/" },
      { label: "Vadodara", href: "/category/p/vadodara/" },
      { label: "Bhavnagar", href: "/category/p/bhavnagar/" },
    ],
  },
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact-us/" },
];
