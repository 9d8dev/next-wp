"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainMenu } from "@/menu.config";

// Desktop primary navigation, mirroring the gujrera.com menu (with a Projects
// dropdown). Client component so the dropdown can open on interaction.
export function MainNav() {
  return (
    <div className="mx-2 hidden md:flex items-center">
      {mainMenu.map((item) =>
        item.children ? (
          <DropdownMenu key={item.href}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                {item.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href={item.href}>All {item.label}</Link>
              </DropdownMenuItem>
              {item.children.map((child) => (
                <DropdownMenuItem key={child.href} asChild>
                  <Link href={child.href}>{child.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button key={item.href} asChild variant="ghost" size="sm">
            <Link href={item.href}>{item.label}</Link>
          </Button>
        )
      )}
    </div>
  );
}
