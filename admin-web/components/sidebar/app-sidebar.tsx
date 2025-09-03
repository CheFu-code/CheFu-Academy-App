"use client";

import {
    IconDashboard,
    IconFolder,
    IconListDetails,
    IconReport,
    IconVideo
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { auth, db } from "@/lib/firebase";
import { User } from "@/types/user";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const navMain = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
    },
    {
        title: "Courses",
        url: "/admin/courses",
        icon: IconListDetails,
    },
    {
        title: "Videos",
        url: "/admin/videos",
        icon: IconVideo,
    },
    {
        title: "Projects",
        url: "#",
        icon: IconFolder,
    },
];

const documents = [
    {
        name: "Reports",
        url: "/admin/reports",
        icon: IconReport,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                const docRef = doc(db, "users", firebaseUser.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUser(docSnap.data() as User);
                } else {
                    // fallback to firebase auth basic data
                    setUser({
                        fullname: firebaseUser.displayName || "Unnamed User",
                        email: firebaseUser.email!,
                        profilePicture: firebaseUser.photoURL || "logo.png",
                    } as User);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/admin">
                                <Image
                                    src="/logo.png"
                                    alt="CheFu Academy"
                                    width={30}
                                    height={30}
                                />
                                <span className="text-base font-semibold">
                                    CheFu Academy
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
                <NavDocuments items={documents} />
            </SidebarContent>

            <SidebarFooter>
                {!loading && user && (
                    <NavUser
                        user={{
                            fullname: user.fullname ?? "Unnamed User",
                            email: user.email,
                            avatar: user.profilePicture || "logo.png",
                        }}
                    />
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
