import Landing from "@/pages/Public/Landing";
import ServerDown from "@/pages/Public/ServerDown";

export const websiteroutes = [
  { path: "/",           element: <Landing />,    },
  { path: "/server-down", element: <ServerDown /> },
];

export const navLinks = [
  { name: "Home",    href: "/"        },
  { name: "About",   href: "#about"   },
  { name: "Contact", href: "#contact" },
  { name: "Courses", href: "#courses"}
];