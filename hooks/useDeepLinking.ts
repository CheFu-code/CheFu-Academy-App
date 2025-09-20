import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useSafeNavigation } from "./useSafeNavigation";

export function useDeepLinking() {
    const { safeReplace, safePush } = useSafeNavigation()
    const lastHandledOrderID = useRef<string | null>(null);

    const handleDeepLink = (url: string) => {
        const parsed = Linking.parse(url);
        const planType = parsed.queryParams?.planType || "basic";
        const orderID =
            typeof parsed.queryParams?.token === "string"
                ? parsed.queryParams.token
                : null;

        if (parsed.path === "success") {
            if (orderID && orderID === lastHandledOrderID.current) return;
            lastHandledOrderID.current = orderID;

            safeReplace({
                pathname: "/subscription/success",
                params: { token: orderID, planType },
            });
        } else if (parsed.path === "cancel") {
            safePush("/subscription/cancel");
        }
    };

    useEffect(() => {
        const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));
        Linking.getInitialURL().then((url) => url && handleDeepLink(url));
        return () => subscription.remove();
    }, []);
}