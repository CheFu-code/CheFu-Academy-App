"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { useState } from "react";

const SecurityTab = () => {
    // states for modals + inputs
    const [openDelete, setOpenDelete] = useState(false);
    const [openChange, setOpenChange] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingChange, setLoadingChange] = useState(false);

    // 🔹 Delete account
    const handleDeleteAccount = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return alert("No user is logged in.");
        if (!deletePassword) return alert("Enter your password first.");

        setLoadingDelete(true);
        try {
            const credential = EmailAuthProvider.credential(
                user.email!,
                deletePassword
            );
            await reauthenticateWithCredential(user, credential);
            await user.delete();
            alert("Your account has been deleted.");
            setOpenDelete(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error deleting account:", error);
                alert(error.message || "Failed to delete account.");
            } else {
                console.error("Unexpected error:", error);
                alert("Failed to delete account.");
            }
        } finally {
            setLoadingDelete(false);
            setDeletePassword("");
        }
    };

    // 🔹 Change password
    const handleChangePassword = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return alert("No user is logged in.");
        if (!currentPassword || !newPassword)
            return alert("Fill in both fields.");

        setLoadingChange(true);
        try {
            const credential = EmailAuthProvider.credential(
                user.email!,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            alert("Your password has been updated.");
            setOpenChange(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error updating password:", error);
                alert(error.message || "Failed to change password.");
            } else {
                console.error("Unexpected error:", error);
                alert("Failed to change password.");
            }
        }
    };

    return (
        <TabsContent value="security" className="mt-4 sm:mt-6 px-2 sm:px-4">
            <Card>
                <CardHeader className="px-3 sm:px-4 py-3">
                    <CardTitle className="text-base sm:text-lg">
                        Security Settings
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Protect your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-4 px-3 sm:px-4 pb-3">
                    {/* Change Password Modal */}
                    <Dialog open={openChange} onOpenChange={setOpenChange}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-sm sm:text-base py-2 px-3 sm:px-4"
                            >
                                Change Password
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>
                                    Enter your current and new password. <br />
                                    <span className="text-red-500 font-medium text-xs">
                                        Note: Changing your password will log
                                        out all other devices currently signed
                                        in with this account. This helps you
                                        keep your account secure.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                            <Input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <DialogFooter>
                                <Button
                                    onClick={handleChangePassword}
                                    disabled={
                                        loadingChange ||
                                        !currentPassword ||
                                        !newPassword
                                    }
                                >
                                    {loadingChange ? "Updating..." : "Update"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Account Modal */}
                    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={loadingDelete}
                                variant="destructive"
                                className="text-sm sm:text-base py-2 px-3 sm:px-4"
                            >
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogDescription>
                                    Enter your password to confirm deletion.
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={deletePassword}
                                onChange={(e) =>
                                    setDeletePassword(e.target.value)
                                }
                            />
                            <DialogFooter>
                                <Button
                                    onClick={handleDeleteAccount}
                                    disabled={loadingDelete || !deletePassword}
                                    variant="destructive"
                                >
                                    {loadingDelete
                                        ? "Deleting..."
                                        : "Delete Account"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default SecurityTab;
