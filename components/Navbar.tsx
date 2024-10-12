'use client';

import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import supabase from '@/api/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/components/auth/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import React from 'react';

export default function Navbar() {
  const { session, setSession } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push('/');
  };

  return (
    <NavigationMenu.Root className="flex flex-col justify-center bg-white h-20 border-b border-grey-border overflow z-10">
      <NavigationMenu.List className="flex justify-between items-center mx-auto w-1170">
        <div className="flex gap-x-10 h-full">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/" title="homepage">
                <div className="flex justify-center items-center gap-x-2">
                  <Image
                    src="/images/updatedlogo.png"
                    alt="HelpingHand Logo"
                    width={70}
                    height={70}
                    className="select-none"
                  />
                  <h1 className="text-3xl font-bold text-black-text font-Metropolis hidden xl:block">
                    HelpingHand
                  </h1>
                </div>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </div>
        <div className={clsx(
          'flex justify-end items-center gap-x-4',
          {
            'gap-x-4': !(session && session.user && session.user.id)
          }
        )}>
          {session && session.user && session.user.id ? (
            <>
              <div className="flex items-center gap-x-6">
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/events/manage"
                      className={clsx(
                        'text-lg font-semibold hover:text-orange py-4',
                        {
                          'text-orange border-b-4 border-orange': path === '/events/manage',
                          'text-navbar-text hover:text-orange': path !== '/events/manage',
                        }
                      )}
                    >
                      Event Management
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/events/matching"
                      className={clsx(
                        'text-lg font-semibold hover:text-orange py-4',
                        {
                          'text-orange border-b-4 border-orange': path === '/events/matching',
                          'text-navbar-text hover:text-orange': path !== '/events/matching',
                        }
                      )}
                    >
                      Volunteer Matching
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/notifications"
                      className={clsx(
                        'text-lg font-semibold hover:text-orange py-4',
                        {
                          'text-orange border-b-4 border-orange': path === '/notifications',
                          'text-navbar-text hover:text-orange': path !== '/notifications',
                        }
                      )}
                    >
                      Notifications
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/events/history"
                      className={clsx(
                        'text-lg font-semibold hover:text-orange py-4',
                        {
                          'text-orange border-b-4 border-orange': path === '/events/history',
                          'text-navbar-text hover:text-orange': path !== '/events/history',
                        }
                      )}
                    >
                      History
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <Menu as="div" className="relative inline-block text-left">
                  <div className="flex justify-center items-center h-full">
                  <Menu.Button className="inline-flex justify-center w-full rounded-md bg-white text-sm font-medium text-navbar-text hover:text-orange focus:outline-none">
                    <MenuIcon className="h-8 w-8" aria-hidden="true" />
                  </Menu.Button>
                  </div>
                  <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                      <Link
                        href="/profile"
                        className={clsx(
                        active ? 'bg-gray-100 text-orange' : 'text-navbar-text',
                        'block px-4 py-2 text-lg'
                        )}
                      >
                        Profile
                      </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={clsx(
                        active ? 'bg-gray-100 text-orange' : 'text-navbar-text',
                        'block w-full text-left px-4 py-2 text-lg'
                        )}
                      >
                        Sign Out
                      </button>
                      )}
                    </Menu.Item>
                    </div>
                  </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </>
          ) : (
            <>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/signin"
                    className={clsx(
                      'text-lg font-semibold hover:text-orange py-4 text-nowrap ml-4',
                      {
                        'text-orange border-b-4 border-orange': path === '/signin',
                        'text-navbar-text hover:text-orange': path !== '/signin',
                      }
                    )}
                  >
                    Login
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/signup"
                    className="border-2 border-darkorange-border bg-orange border-b-4 hover:bg-orange-button-hover text-white rounded-xl px-8 py-2 font-medium ml-2 text-nowrap"
                  >
                    Sign Up
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </>
          )}
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}