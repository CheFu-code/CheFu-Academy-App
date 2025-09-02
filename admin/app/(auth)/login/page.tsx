"use client";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.replace("/");
            }
        });

        return () => unsubscribe();
    }, [router]);

    return <LoginForm />;
}
