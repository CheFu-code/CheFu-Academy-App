"use client";

import { BookOpen, LifeBuoy, Send, Settings2, Video } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthUser } from "@/hooks/useAuthUser";
import Image from "next/image";

const data = {
    navMain: [
        {
            title: "Learning Hub",
            url: "#",
            icon: BookOpen,
            isActive: true,
            items: [
                { title: "My Courses", url: "/courses/my-courses" },
                { title: "Practice", url: "/courses/practice" },
                {
                    title: "Completed Lessons",
                    url: "/courses/completed-lessons",
                },
            ],
        },

        {
            title: "Videos",
            url: "#",
            icon: Video,
            items: [
                {
                    title: "All Videos",
                    url: "/videos/all-videos",
                },
                {
                    title: "Beginner",
                    url: "/videos/beginner",
                },
                {
                    title: "Advanced",
                    url: "/videos/advanced",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Account",
                    url: "/settings/account",
                },
                {
                    title: "Billing",
                    url: "/settings/billing",
                },
                {
                    title: "Privacy Policy",
                    url: "/settings/privacy-policy",
                },
                {
                    title: "Terms of Service",
                    url: "/settings/terms-service",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "/support",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "/feedback",
            icon: Send,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, loading } = useAuthUser();
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/courses">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Image
                                        alt="Logo"
                                        width={52}
                                        height={52}
                                        src={"/logo.png"}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        CheFu Inc.
                                    </span>
                                    <span className="truncate text-xs">
                                        Academy
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
