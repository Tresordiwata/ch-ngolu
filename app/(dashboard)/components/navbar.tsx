'use client';

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { Building2, FileText, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { Notifications } from "./notifications";

export function Navbar() { 
  const router = useRouter();
  const { utilisateur, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <NextUINavbar>
      <NavbarBrand>
        <Building2 className="text-primary" />
        <p className="font-bold text-inherit">Gestion Finance</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/depenses" className="hover:text-primary">
            Dépenses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/entrees" className="hover:text-primary">
            Entrées
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/reporting" className="hover:text-primary">
            Reporting
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/parametres" className="hover:text-primary">
            Paramètres
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Notifications />
        </NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              startContent={<User className="h-4 w-4" />}
            >
              {utilisateur?.nom}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownItem key="profile" startContent={<User />}>
              Mon Profil
            </DropdownItem>
            <DropdownItem key="settings" startContent={<Settings />}>
              Paramètres
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              startContent={<LogOut />}
              onPress={handleLogout}
            >
              Déconnexion
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenuToggle className="sm:hidden" />
      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/depenses" className="w-full">
            Dépenses
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/entrees" className="w-full">
            Entrées
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/reporting" className="w-full">
            Reporting
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/parametres" className="w-full">
            Paramètres
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
}