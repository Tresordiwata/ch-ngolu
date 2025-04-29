export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CH-NGOLU :: Application Finance",
  description: "Application de Gestion Financiere du CH-NGOLU",
  navItems: [
    {
      label: "Depense",
      href: "/depenses",
    },
    {
      label: "Recette",
      href: "/entrees",
    },
    {
      label: "Finance",
      href: "/finance",
    },
    {
      label: "Reports",
      href: "/reporting",
    },
    {
      label: "Parametres",
      href: "/parametres",
    }
  ],
  navMenuItems: [
    {
      label: "Tableau de Bord",
      href: "/dashbord",
    },
    {
      label: "Depense",
      href: "/recette",
    },
    {
      label: "Recette",
      href: "/entrees",
    },
    {
      label: "Finance",
      href: "/entrees",
    },
    {
      label: "Reports",
      href: "/reporting",
    },
    {
      label: "Parametres",
      href: "/parametre",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "#",
    twitter: "#",
    docs: "#",
    discord: "#",
    sponsor: "#",
  },
};
