"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/firebase";
import {
    IconActivity,
    IconBook,
    IconMessage,
    IconUsers,
} from "@tabler/icons-react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export function SectionCards() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [systemActivity, setSystemActivity] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            // Users
            const usersSnapshot = await getDocs(collection(db, "users"));
            setTotalUsers(usersSnapshot.size);

            // Courses
            const coursesSnapshot = await getDocs(collection(db, "course"));
            setTotalCourses(coursesSnapshot.size);

            // Messages
            const messagesSnapshot = await getDocs(collection(db, "chats"));
            setTotalMessages(messagesSnapshot.size);

            const activitySnapshot = await getDocs(
                collection(db, "reports")
            );
            setSystemActivity(activitySnapshot.size);
        };

        fetchStats();
    }, [db]);

    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {/* Total Users */}
            <Card>
                <CardHeader>
                    <CardDescription>Total Users</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                        {totalUsers}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconUsers /> +{totalUsers > 0 ? "10%" : "0%"}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter>Total registered users in the system</CardFooter>
            </Card>

            {/* Total Courses */}
            <Card>
                <CardHeader>
                    <CardDescription>Total Courses</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                        {totalCourses}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconBook /> +{totalCourses > 0 ? "5%" : "0%"}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter>Total courses available in the platform</CardFooter>
            </Card>

            {/* Total Messages */}
            <Card>
                <CardHeader>
                    <CardDescription>Messages</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                        {totalMessages}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconMessage /> +{totalMessages > 0 ? "8%" : "0%"}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter>Messages exchanged between users/admins</CardFooter>
            </Card>

            {/* System Activity */}
            <Card>
                <CardHeader>
                    <CardDescription>Total Reports</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                        {systemActivity}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconActivity /> +
                            {systemActivity > 0 ? "12%" : "0%"}
                        </Badge>
                    </CardAction>
                </CardHeader>
            </Card>
        </div>
    );
}
