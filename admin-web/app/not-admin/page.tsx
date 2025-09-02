import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
            <Card className="w-full max-w-sm sm:max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="bg-destructive/10 rounded-full p-4 sm:p-6 w-fit mx-auto">
                        <ShieldX className="size-12 sm:size-16 text-destructive" />
                    </div>

                    <CardTitle className="text-xl sm:text-2xl">
                        Access Restricted
                    </CardTitle>

                    <CardDescription className="mt-1 sm:mt-2 text-center max-w-xs mx-auto text-sm sm:text-base">
                        You do not have permission to view this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link
                        href={"/"}
                        className={buttonVariants({
                            className: "w-full justify-center",
                        })}
                    >
                        <ArrowLeft className="mr-1 size-4" />
                        Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
