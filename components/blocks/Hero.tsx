'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Section, Container } from '@/components/craft'
import Image from 'next/image'

// TypeScript interface for Hero props
export interface HeroProps {
  // Navigation
  navigation?: Array<{ name: string; href: string }>;
  logoUrl?: string;
  logoAlt?: string;
  
  // Badge (announcement)
  badge?: {
    text: string;
    linkText?: string;
    linkHref?: string;
  };
  
  // Main content
  title: string;
  subtitle: string;
  
  // CTAs
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  
  // Styling
  bgColor?: string;
  textColor?: string;
  
  // Background decorations
  showDecorations?: boolean;
}

export function Hero({
  navigation = [],
  logoUrl = 'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500',
  logoAlt = 'Your Company',
  badge,
  title = 'Data to enrich your online business',
  subtitle = 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
  primaryCta = { text: 'Get started', href: '#' },
  secondaryCta = { text: 'Learn more', href: '#' },
  bgColor = 'bg-gray-900',
  textColor = 'text-white',
  showDecorations = true,
}: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={bgColor}>
      <div className="absolute inset-x-0 top-0 z-10">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">{logoAlt}</span>
              <Image
                alt={logoAlt}
                src={logoUrl}
                className="h-8 w-auto"
              />
            </a>
          </div>
          {navigation.length > 0 && (
            <>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                  <a key={item.name} href={item.href} className={`text-sm/6 font-semibold ${textColor}`}>
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="#" className={`text-sm/6 font-semibold ${textColor}`}>
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </>
          )}
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto ${bgColor} p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10`}>
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">{logoAlt}</span>
                <Image
                  alt={logoAlt}
                  src={logoUrl}
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${textColor} hover:bg-white/5`}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className={`-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold ${textColor} hover:bg-white/5`}
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </div>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        {showDecorations && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              />
            </div>
          </>
        )}
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          {badge && (
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                {badge.text}{' '}
                {badge.linkText && badge.linkHref && (
                  <a href={badge.linkHref} className="font-semibold text-indigo-400">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {badge.linkText} <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <h1 className={`text-5xl font-semibold tracking-tight text-balance ${textColor} sm:text-7xl`}>
              {title}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              {subtitle}
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {primaryCta && primaryCta.text && (
                <a
                  href={primaryCta.href || '#'}
                  className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {primaryCta.text}
                </a>
              )}
              {secondaryCta && secondaryCta.text && (
                <a href={secondaryCta.href || '#'} className={`text-sm/6 font-semibold ${textColor}`}>
                  {secondaryCta.text} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

