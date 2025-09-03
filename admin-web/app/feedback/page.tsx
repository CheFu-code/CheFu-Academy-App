"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "@/hooks/useAuthUser";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "sonner";

const Feedback = () => {
    const currentYear = new Date().getFullYear();
    const { user } = useAuthUser();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "feedback"), {
                providedName: name,
                realName: user?.fullname || null,
                providedEmail: email,
                realEmail: user?.email || null,
                message,
                createdAt: serverTimestamp(),
                userId: user?.uid || null,
                planType: user?.subscriptionStatus || "Free",
                device: navigator.userAgent,
                pageURL: window.location.href,
                referrer: document.referrer || null,
                status: "new",
                resolved: false,
            });

            setName("");
            setEmail("");
            setMessage("");
            toast.success("Feedback submitted successfully!");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Feedback</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
                We value your feedback. Please share your thoughts, suggestions,
                or issues below.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                        Submit Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3 sm:space-y-4"
                    >
                        <div>
                            <Label
                                htmlFor="name"
                                className="text-sm sm:text-base"
                            >
                                Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="email"
                                className="text-sm sm:text-base"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="message"
                                className="text-sm sm:text-base"
                            >
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Write your feedback here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                © {currentYear} CheFu Inc
            </p>
        </div>
    );
};

export default Feedback;
