'use client'

import { useEffect } from "react"
import BigCalendar from "./bigCalendar/page"
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

const Home = () => {
  const auth = useSession();
  const route = useRouter();

  useEffect(() => {
    if (!auth?.data?.user?.name) {
      route.replace('/login');
    }
  }, []);

  return <main className="relative sm:px-10 md:px-30 lg:px-50 2xl:px-80">
    <BigCalendar />
  </main>
}

const HomeWithSession = () => {
  return <SessionProvider>
    <Home />
  </SessionProvider>
}

export default HomeWithSession;