import {cn} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "@root/public/logo.svg";
import {getSiteConfig} from "@root/site.config";
import {mainMenu} from "@root/menu.config";
import {Button} from "@/components/ui/button";
import {MobileNav} from "@/components/nav/mobile-nav";
import React from "react";

type Props = {
    className?: string;
    children?: React.ReactNode;
    id?: string;
};

export async function Header({className, children, id}: Props) {
    const config = await getSiteConfig();

    return (
        <nav
            className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
            id={id}
        >
            <div
                id="nav-container"
                className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
            >
                <Link
                    className="hover:opacity-75 transition-all flex gap-4 items-center"
                    href="/"
                >
                    <Image
                        src={Logo}
                        alt="Logo"
                        loading="eager"
                        className="dark:invert w-[42px] h-auto"
                        width={42}
                        height={26.44}
                    ></Image>
                    <h2 className="text-sm">{config.site_name}</h2>
                </Link>
                {children}
                <div className="flex items-center gap-2">
                    <div className="mx-2 hidden md:flex">
                        {Object.entries(mainMenu).map(([key, href]) => (
                            <Button key={href} asChild variant="ghost" size="sm">
                                <Link href={href}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Link>
                            </Button>
                        ))}
                    </div>
                    <Button asChild className="hidden sm:flex">
                        <Link href="https://github.com/9d8dev/next-wp">Get Started</Link>
                    </Button>
                    <MobileNav/>
                </div>
            </div>
        </nav>
    );
}