import NetInfo from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";

const NetworkContext = createContext({ isConnected: true });

export const NetworkProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isConnected, setIsConnected] = useState(true);

    const checkInternetAccess = async () => {
        try {
            const response = await fetch(
                "https://www.google.com/generate_204",
                {
                    method: "GET",
                    cache: "no-store",
                }
            );
            setIsConnected(response.status === 204);
        } catch {
            setIsConnected(false);
        }
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable) {
                checkInternetAccess(); // deeper check
            } else {
                setIsConnected(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => useContext(NetworkContext);
