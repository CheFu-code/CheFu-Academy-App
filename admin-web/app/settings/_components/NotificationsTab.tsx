import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Mail } from "lucide-react";
import { useState } from "react";

const NotificationsTab = () => {
    const [notifications, setNotifications] = useState(true);
    return (
        <TabsContent value="notifications" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Manage your learning updates
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span>Email Updates</span>
                    </div>
                    <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                    />
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default NotificationsTab;
