import {Container, Section} from "@/components/craft";
import Link from "next/link";
import {siteConfig} from "@root/site.config";
import Image from "next/image";
import Logo from "@root/public/logo.svg";
import Balancer from "react-wrap-balancer";
import {contentMenu, mainMenu} from "@root/menu.config";
import {ThemeToggle} from "@/components/theme/theme-toggle";

type Props = {};

export function Footer(props: Props) {
    return (
        <footer>
            <Section>
                <Container className="grid md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
                    <div className="flex flex-col gap-6 not-prose">
                        <Link href="/">
                            <h3 className="sr-only">{siteConfig.site_name}</h3>
                            <Image
                                src={Logo}
                                alt="Logo"
                                className="dark:invert"
                                width={42}
                                height={26.44}
                            ></Image>
                        </Link>
                        <p>
                            <Balancer>{siteConfig.site_description}</Balancer>
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <h5 className="font-medium text-base">Website</h5>
                        {Object.entries(mainMenu).map(([key, href]) => (
                            <Link
                                className="hover:underline underline-offset-4"
                                key={href}
                                href={href}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <h5 className="font-medium text-base">Blog</h5>
                        {Object.entries(contentMenu).map(([key, href]) => (
                            <Link
                                className="hover:underline underline-offset-4"
                                key={href}
                                href={href}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
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