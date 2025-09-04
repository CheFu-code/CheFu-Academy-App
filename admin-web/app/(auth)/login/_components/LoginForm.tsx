"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailPending, startEmailTransition] = useTransition();
    const [googlePending, startGoogleTransition] = useTransition();
    const router = useRouter();

    const handleGoogle = async () => {
        startGoogleTransition(async () => {
            try {
                const provider = new GoogleAuthProvider();

                // OPTIONAL: set the web client ID explicitly (if needed)
                provider.setCustomParameters({
                    client_id:
                        "441077080510-376i017sckjqhff8mf491f4erskpmp3d.apps.googleusercontent.com",
                });

                const result = await signInWithPopup(auth, provider);

                // You can get user info if needed
                const user = result.user;

                toast.success("Login successful!");
                router.replace("/courses"); // redirect after login
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Google login failed:", error);

                    // Some Firebase auth errors come as objects with `code`
                    const firebaseError = error as {
                        code?: string;
                        message?: string;
                    };

                    if (firebaseError.code === "auth/popup-closed-by-user") {
                        toast.error("Login cancelled by user.");
                    } else if (
                        firebaseError.code === "auth/invalid-credential"
                    ) {
                        toast.error(
                            "Invalid credentials. Check your Google OAuth setup."
                        );
                    } else {
                        toast.error(
                            "Google login failed. Please try again later."
                        );
                    }
                } else {
                    console.error("Unknown error during Google login:", error);
                    toast.error("Unexpected error occurred. Please try again.");
                }
            }
        });
    };

    const handleEmailLogin = async () => {
        startEmailTransition(async () => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                router.replace("/courses");
                toast.success("Login successful!");
            } catch (error) {
                toast.error("Login failed. Please try again later.");
                console.error("Email login failed:", error);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>
                    Login to access your courses and continue learning.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-row justify-center gap-4">
                    <Button
                        disabled={googlePending}
                        onClick={handleGoogle}
                        variant="outline"
                    >
                        {googlePending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <FcGoogle className="size-4" />
                                <span>Sign in with Google</span>
                            </>
                        )}
                    </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="me@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        disabled={emailPending || !email || !password}
                        onClick={handleEmailLogin}
                    >
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
