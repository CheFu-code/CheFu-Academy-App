"use client";

import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { useAuthUser } from "@/hooks/useAuthUser";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

const AdminIndexPage = () => {
    const { user } = useAuthUser();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground animate-pulse">
                    Loading user data...
                </p>
            </div>
        );
    }

    return (
        <>
            {user && <SectionCards />}
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            {/* <DataTable user={currentUser} /> */}
        </>
    );
};

export default AdminIndexPage;
