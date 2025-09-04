"use client";

import { buttonVariants } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/useAuthUser";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuthUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/courses");
        }
    }, [loading, user, router]);
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link
                href={"/"}
                className={buttonVariants({
                    variant: "outline",
                    className: "absolute left-4 top-4 md:left-8 md:top-8",
                })}
            >
                <ArrowLeft className="size-4" />
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    className="flex items-center gap-2 self-center font-bold"
                    href={"/"}
                >
                    <Image
                        src="/logo.png"
                        alt="CheFu Academy"
                        width={42}
                        height={42}
                    />
                    CheFu Academy
                </Link>
                {children}

                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue you agree to our{" "}
                    <Link
                        href={"/terms-service"}
                        className="hover:text-primary hover:underline font-medium"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href={"/privacy-policy"}
                        className="hover:text-primary hover:underline font-medium"
                    >
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
