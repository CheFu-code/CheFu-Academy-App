"use client";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types/user";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserDropdown from "./UserDropdown";

const navigationItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Courses",
        href: "/courses",
    },
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "About",
        href: "/about",
    },
];

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // <-- track loading

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                const docRef = doc(db, "users", firebaseUser.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) setUser(docSnap.data() as User);
                else
                    setUser({
                        email: firebaseUser.email,
                        fullname: "",
                    } as User); // fallback
            } else {
                setUser(null);
            }
            setLoading(false); // finished checking auth
        });

        return () => unsubscribe();
    }, []);

    console.log("User in Navbar:", user);
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 ">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center space-x-2 py-4 mr-4"
                >
                    <Image width={70} height={70} src="/logo.png" alt="Logo" />
                    <span className="font-bold">CheFu Academy</span>
                </Link>

                <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div className="items-center space-x-4 ">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4 justify-end">
                        <ThemeToggle />
                        {user ? (
                            <Link
                                href="/"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                <UserDropdown user={user} />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className={buttonVariants({ size: "sm" })}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
