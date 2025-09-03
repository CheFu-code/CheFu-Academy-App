import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { useAuthUser } from "@/hooks/useAuthUser";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProfileTab = () => {
    const { user } = useAuthUser();
    const [name, setName] = useState(user?.fullname ?? "");
    const [bio, setBio] = useState(user?.bio ?? "");
    const [loading, setLoading] = useState(false);
    const [prefs, setPrefs] = useState(
        user?.emailPreferences ?? {
            activity: false,
            general: false,
            marketing: false,
            security: true,
        }
    );

    useEffect(() => {
        if (user?.emailPreferences) {
            setPrefs(user.emailPreferences);
        }
    }, [user]);

    if (!user) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const userRef = doc(db, "users", user.email);
            await updateDoc(userRef, {
                fullname: name,
                bio: bio,
            });
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile:", err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key: keyof typeof prefs, value: boolean) => {
        try {
            // Update local state
            setPrefs((prev) => ({ ...prev, [key]: value }));

            // Update Firestore
            const userRef = doc(db, "users", user.email);
            await updateDoc(userRef, {
                emailPreferences: {
                    ...prefs,
                    [key]: value,
                },
            });
        } catch (err) {
            console.error("Failed to update preference:", err);
        }
    };

    return (
        <>
            <TabsContent value="profile" className="mt-4 sm:mt-6">
                <Card className="p-3 sm:p-6">
                    <CardHeader className="space-y-1 sm:space-y-2">
                        <CardTitle className="text-base sm:text-lg">
                            Edit Profile
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Update your account details
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 sm:space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-1 sm:space-y-2">
                            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                Basic Info
                            </h3>

                            <div className="grid gap-1 sm:gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs sm:text-sm"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid gap-1 sm:gap-2">
                                <Label
                                    htmlFor="bio"
                                    className="text-xs sm:text-sm"
                                >
                                    Bio
                                </Label>
                                <Input
                                    multiple
                                    id="bio"
                                    placeholder="Your bio..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid gap-1">
                                <p className="text-xs sm:text-sm">
                                    <span className="font-medium">Email:</span>{" "}
                                    <span className="text-muted-foreground">
                                        {user?.email}
                                    </span>
                                </p>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    Changing the email address is not permitted.
                                </span>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={loading || !name}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Account Details */}
                        <div className="space-y-1 sm:space-y-2">
                            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                Account
                            </h3>
                            <div className="grid gap-1 sm:gap-2 text-xs sm:text-sm">
                                <p>
                                    <span className="font-medium">
                                        Created:
                                    </span>{" "}
                                    {user?.createdAt
                                        .toDate()
                                        .toLocaleDateString()}
                                </p>
                                <p>
                                    <span className="font-medium">Roles:</span>{" "}
                                    {user?.roles.join(", ")}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Subscription:
                                    </span>{" "}
                                    {user?.subscriptionStatus}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Verified:
                                    </span>
                                    {user?.isVerified ? (
                                        <Badge
                                            className="ml-1"
                                            variant="default"
                                        >
                                            Yes
                                        </Badge>
                                    ) : (
                                        <Badge
                                            className="ml-1"
                                            variant="destructive"
                                        >
                                            No
                                        </Badge>
                                    )}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Preferences */}
                        <div className="space-y-1 sm:space-y-2">
                            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                Preferences
                            </h3>
                            <div className="grid gap-1 sm:gap-2 mt-1 sm:mt-2">
                                {prefs &&
                                    (
                                        [
                                            "activity",
                                            "general",
                                            "marketing",
                                            "security",
                                        ] as const
                                    ).map((key) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between text-xs sm:text-sm"
                                        >
                                            <span>{`${
                                                key.charAt(0).toUpperCase() +
                                                key.slice(1)
                                            } Emails`}</span>
                                            <Switch
                                                checked={prefs[key]}
                                                onCheckedChange={(val) =>
                                                    handleToggle(key, val)
                                                }
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    );
};

export default ProfileTab;
