'use client';
import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';
export default function LeftSidebar() {
   const router = useRouter();
   const pathname = usePathname();

   const { userId } = useAuth();

   return (
      <section className="custom-scrollbar leftsidebar">
         <div className="flex flex-col flex-1 w-full px-6 gap-6">
            {sidebarLinks.map((link, index) => {
               const isActive =
                  (pathname.includes(link.route) && link.route.length > 1) ||
                  pathname === link.route;
               link.route === '/profile'
                  ? (link.route = `${link.route}/${userId}`)
                  : '';

               return (
                  <Link
                     href={link.route}
                     key={link.label}
                     className={`leftsidebar_link ${
                        isActive && 'bg-primary-500'
                     }`}
                  >
                     <Image
                        alt={link.label}
                        src={link.imgURL}
                        width={24}
                        height={24}
                     />
                     <p className="text-light-1 max-lg:hidden">{link.label}</p>
                  </Link>
               );
            })}
         </div>
         <div className="mt-10 px-6">
            <SignedIn>
               <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                  <div className="flex cursor-pointer gap-4 p-4">
                     <Image
                        src="/assets/logout.svg"
                        alt="logout"
                        width={24}
                        height={24}
                     />
                     <p className="text-light-2 max-lg:hidden">Logout</p>
                  </div>
               </SignOutButton>
            </SignedIn>
         </div>
      </section>
   );
}
