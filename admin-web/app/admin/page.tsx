import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";
import { User } from "@/types/user";

const AdminIndexPage = ({ user }: { user: User | null }) => {
    return (
        <>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            {user && <DataTable user={user} />}
        </>
    );
};

export default AdminIndexPage;
