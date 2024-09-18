'use client';

import Link from 'next/link';
// import Image from 'next/image';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { usePathname } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import clsx from 'clsx';

export default function Navbar() {
  const path = usePathname();
  // const { data: session } = useSession();

  return (
    <NavigationMenu.Root className="flex flex-col justify-center bg-white h-20 border-b border-grey-border overflow">
      <NavigationMenu.List className="flex justify-between items-center mx-auto w-1170">
        <div className="flex gap-x-10 h-full">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/" title="homepage">
                <div className="flex justify-center items-center gap-x-2">
                  {/* <Image
                    src="/navbarLogo.svg"
                    alt="HelpingHand Logo"
                    width={35}
                    height={35}
                    className="select-none"
                  /> */}
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
            // 'gap-x-4': !(session && session.user && session.user.id)
          }
        )}>
          {
            // session && session.user && session.user.id ? (
            //   <>
            //     <NavigationMenu.Item>
            //       {/* <UserDropdown /> */}
            //     </NavigationMenu.Item>
            //   </>
            // ) : (
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
                  <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                      <Link
                        href="/profile"
                        className={clsx(
                          'text-lg font-semibold hover:text-orange py-4',
                          {
                            'text-orange border-b-4 border-orange': path === '/profile',
                            'text-navbar-text hover:text-orange': path !== '/profile',
                          }
                        )}
                      >
                        Profile
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                </div>
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
            // )
          }
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
