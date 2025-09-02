"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth, db } from "@/lib/firebase";
import { featureProps } from "@/types/feature";
import { User } from "@/types/user";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const features: featureProps[] = [
    {
        title: "Comprehensive Courses",
        description: "Dive deep into our extensive course offerings.",
        icon: "📚",
    },
    {
        title: "Interactive Learning",
        description:
            "Engage with our interactive content, flashcards, and quizzes.",
        icon: "🧩",
    },
    {
        title: "Personalized Learning",
        description: "Get recommendations tailored to your learning style.",
        icon: "🎯",
    },
    {
        title: "Progress Tracking",
        description:
            "Monitor your learning journey with our progress tracking tools.",
        icon: "📈",
    },
    {
        title: "Community Support",
        description: "Connect with fellow learners and get help.",
        icon: "🤝",
    },
];

const Home = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // <-- track loading
    const router = useRouter();

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

    // useEffect(() => {
    //     if (!loading && !user) {
    //         router.replace("/login");
    //     }
    // }, [loading, user, router]);

    // if (loading) return <p>Loading user info...</p>;

    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant={"outline"}>
                        Smart Learning Starts Here
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Expand your knowledge with our courses
                    </h1>
                    <p className="max-w-[700px] md:text-xl text-muted-foreground">
                        Join our community of learners and take your skills to
                        the next level.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link
                            className={buttonVariants({
                                size: "lg",
                            })}
                            href="/courses"
                        >
                            Explore Courses
                        </Link>
                        {!user ? (
                            <Link
                                className={buttonVariants({
                                    size: "lg",
                                    variant: "outline",
                                })}
                                href="/login"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <Button
                                className={buttonVariants({
                                    size: "lg",
                                })}
                                onClick={() => router.push("/profile")}
                            >
                                Get Started
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            <section className="grid cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <div className="text-4xl mb-4">{feature.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
};

export default Home;
