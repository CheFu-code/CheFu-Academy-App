import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export function useDeepLinking() {
    const router = useRouter();
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

            router.replace({
                pathname: "/subscription/success",
                params: { token: orderID, planType },
            });
        } else if (parsed.path === "cancel") {
            router.push("/subscription/cancel");
        }
    };

    useEffect(() => {
        const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));
        Linking.getInitialURL().then((url) => url && handleDeepLink(url));
        return () => subscription.remove();
    }, []);
}