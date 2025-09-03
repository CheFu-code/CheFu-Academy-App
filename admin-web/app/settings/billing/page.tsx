"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import BillingHistory from "../_components/BillingHistory";
import CurrentPlan from "../_components/CurrentPlan";

const BillingPage = () => {
    const { user } = useAuthUser();

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">
                Billing & Subscription
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
                Manage your plan, billing details, and usage here.
            </p>

            <div className="space-y-4">
                <CurrentPlan />
                <BillingHistory />
            </div>
        </div>
    );
};

export default BillingPage;
