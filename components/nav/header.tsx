'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/site.config'
import Logo from '@/public/logo.svg'
import type { MenuItem } from '@/lib/wordpress-menu'

interface HeaderProps {
  menuItems: MenuItem[]
}

export function Header({ menuItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Separate items with and without children
  const topLevelItems = menuItems.filter(item => !item.children || item.children.length === 0)
  const dropdownItems = menuItems.filter(item => item.children && item.children.length > 0)

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pointer-events-auto">
      <nav aria-label="Global" className="mx-auto flex items-center justify-between px-6 py-4 lg:px-8 relative z-[101] pointer-events-auto" style={{ maxWidth: '85rem' }}>
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="sr-only">{siteConfig.site_name}</span>
            <Image
              src={Logo}
              alt={siteConfig.site_name}
              width={32}
              height={20}
              className="dark:invert"
              priority
            />
            <span className="text-base font-bold tracking-tight">{siteConfig.site_name}</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:bg-accent transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop menu */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-1">
          {/* Dropdown items */}
          {dropdownItems.map((item) => (
            <Popover key={item.id} className="relative">
              <PopoverButton className="flex items-center gap-x-1 px-3 py-2 text-sm font-medium leading-6 text-foreground hover:bg-accent rounded-md transition-colors outline-none">
                {item.title}
                <ChevronDownIcon aria-hidden="true" className="h-4 w-4 flex-none text-muted-foreground" />
              </PopoverButton>

              <PopoverPanel
                transition
                className="absolute left-1/2 top-full z-[110] mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-2xl bg-popover border shadow-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
              >
                <div className="p-6 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      target={child.target}
                      className="group relative flex items-start gap-x-4 rounded-lg p-3 text-sm leading-6 hover:bg-accent transition-colors"
                    >
                      <div className="flex-auto">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {child.title}
                        </div>
                        {child.description && (
                          <p className="mt-1 text-xs text-muted-foreground">{child.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>
          ))}

          {/* Top level items (no dropdown) */}
          {topLevelItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.target}
              className="px-3 py-2 text-sm font-medium leading-6 text-foreground hover:bg-accent rounded-md transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </PopoverGroup>

        {/* Right side actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-[201] w-full overflow-y-auto bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-border shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">{siteConfig.site_name}</span>
              <Image
                src={Logo}
                alt={siteConfig.site_name}
                width={32}
                height={20}
                className="dark:invert"
              />
              <span className="text-base font-bold tracking-tight">{siteConfig.site_name}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-foreground hover:bg-accent transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="flow-root">
            <div className="space-y-1">
              {/* Dropdown items in mobile */}
              {dropdownItems.map((item) => (
                <Disclosure key={item.id} as="div">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium leading-7 text-foreground hover:bg-accent transition-colors">
                    {item.title}
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-open:rotate-180 transition-transform" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-1 space-y-1 pl-4">
                    {item.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={child.url}
                        target={child.target}
                        className="block rounded-lg px-3 py-2 text-sm font-medium leading-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              ))}

              {/* Top level items in mobile */}
              {topLevelItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.target}
                  className="block rounded-lg px-3 py-2 text-base font-medium leading-7 text-foreground hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              <div className="pt-6 border-t mt-6">
                <Button asChild className="w-full" size="default">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

