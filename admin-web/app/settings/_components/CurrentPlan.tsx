import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useState } from "react";

const CurrentPlan = () => {
    const { user } = useAuthUser();
    const currentPlan = user?.subscriptionStatus || "Free";
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubscribe = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        You are currently on the{" "}
                        <span className="font-semibold">{currentPlan}</span>{" "}
                        plan.
                    </p>

                    {!user?.member && (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSubscribe}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                    )}

                    {user?.member && (
                        <div>
                            <p>
                                Your plan will expire on{" "}
                                {user?.memberUntil
                                    ? user.memberUntil
                                          .toDate()
                                          .toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upgrade Warning Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upgrade Plan</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground my-2">
                        Upgrading your plan is currently only available in our
                        mobile app. Please use the app to upgrade.
                    </p>
                    <DialogFooter>
                        <Button
                            className="bg-gray-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() =>
                                window.open(
                                    "https://play.google.com/store/apps/details?id=com.chefu.academy",
                                    "_blank"
                                )
                            }
                            className="bg-blue-600 hover:bg-blue-800 cursor-pointer"
                        >
                            Download App
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CurrentPlan;
