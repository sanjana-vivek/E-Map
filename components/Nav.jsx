"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session} = useSession();
  // sign-in using google in next-auth
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);
  return (
    <nav className="flex-between w-full mb-13 pt-3">
      <Link href="/">
        <div className="flex gap-2 flex-center">
          <Image
            src="/assets/images/e-map-icon-color.png"
            alt="E-Map Logo"
            width={60}
            height={60}
            className="object-contain"
          />
          <p className="logo_text">E-Map</p>
        </div>
      </Link>
      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/upload-file" className="black_btn">
              Upload file
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                src="/assets/icons/profile.png"
                alt="Profile icon"
                width={50}
                height={50}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {/* my provider is google auth */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
