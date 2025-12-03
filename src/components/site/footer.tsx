import {Container, Section} from "@/components/craft";
import Link from "next/link";
import {getSiteConfig} from "@root/site.config";
import {getAllMenus} from "@root/menu.config";
import Image from "next/image";
import Logo from "@root/public/logo.svg";
import Balancer from "react-wrap-balancer";
import {ThemeToggle} from "@/components/theme/theme-toggle";

type Props = {};

export async function Footer(props: Props) {
    const config = await getSiteConfig();
    const menus = await getAllMenus();
    const mainMenu = menus.primary || [];
    const contentMenu = menus.footer || [];

    return (
        <footer>
            <Section>
                <Container className="grid md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
                    <div className="flex flex-col gap-6 not-prose">
                        <Link href="/">
                            <h3 className="sr-only">{config.site_name}</h3>
                            <Image
                                src={Logo}
                                alt="Logo"
                                className="dark:invert"
                                width={42}
                                height={26.44}
                            ></Image>
                        </Link>
                        <p>
                            <Balancer>{config.site_description}</Balancer>
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <h5 className="font-medium text-base">Website</h5>
                        {mainMenu.map((item) => (
                            <Link
                                className="hover:underline underline-offset-4"
                                key={item.id}
                                href={item.url}
                                target={item.target || undefined}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <h5 className="font-medium text-base">Blog</h5>
                        {contentMenu.map((item) => (
                            <Link
                                className="hover:underline underline-offset-4"
                                key={item.id}
                                href={item.url}
                                target={item.target || undefined}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </Container>
                <Container
                    className="border-t not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center">
                    <ThemeToggle/>
                    <p className="text-muted-foreground">
                        &copy; <a href="https://9d8.dev">9d8</a>. All rights reserved.
                        2025-present.
                    </p>
                </Container>
            </Section>
        </footer>
    );
}