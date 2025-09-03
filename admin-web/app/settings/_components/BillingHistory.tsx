import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Payment } from "@/types/payment";
import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const BillingHistory = () => {
    const { user } = useAuthUser();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return; // wait until user exists

        const fetchPayments = async () => {
            console.log("Fetching payments for user:", user.email);
            try {
                const db = getFirestore();
                const q = query(
                    collection(db, "payments"),
                    where("email", "==", user.email)
                );
                const snapshot = await getDocs(q);
                const fetched: Payment[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        orderID: data.orderID,
                        payerID: data.payerID,
                        payerName: {
                            given_name: data.payerName?.given_name || "",
                            surname: data.payerName?.surname || "",
                        },
                        email: data.email,
                        amount: {
                            currency_code: data.amount?.currency_code || "USD",
                            value: data.amount?.value || "0.00",
                        },
                        planType: data.planType,
                        status: data.status,
                        timestamp: data.timestamp
                            ? new Date(data.timestamp)
                            : new Date(),
                    };
                });

                setPayments(fetched);
                console.log("Fetched payments:", fetched);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user?.email]);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center  flex-col">
                        <p className="text-muted-foreground text-sm animate-bounce">
                            loading...
                        </p>
                        <Loader className="inline-block animate-spin" />
                    </div>
                ) : payments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        No billing history yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {payments.length === 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Billing History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        No billing history yet.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            payments.map((p) => (
                                <Card
                                    key={p.orderID}
                                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 hover:shadow-lg transition-shadow border border-muted-foreground/20"
                                >
                                    {/* Left: Date & Plan */}
                                    <div className="flex flex-col mb-2 md:mb-0">
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(
                                                p.timestamp
                                            ).toLocaleDateString()}
                                        </span>
                                        <span className="text-sm font-medium text-gray-400">
                                            {p.planType}
                                        </span>
                                    </div>

                                    {/* Center: Amount */}
                                    <div className="text-sm font-semibold text-gray-400 mb-2 md:mb-0">
                                        {p.amount.currency_code}{" "}
                                        {p.amount.value}
                                    </div>

                                    {/* Right: Status */}
                                    <Badge
                                        variant={
                                            p.status === "COMPLETED"
                                                ? "default"
                                                : "destructive"
                                        }
                                        className="capitalize"
                                    >
                                        {p.status.toLowerCase()}
                                    </Badge>

                                    {/* Optional: Payer Name */}
                                    <div className="text-sm text-gray-400 mt-2 md:mt-0 md:ml-4">
                                        {p.payerName.given_name}{" "}
                                        {p.payerName.surname}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BillingHistory;
