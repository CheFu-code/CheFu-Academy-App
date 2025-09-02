"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase"; // your firebase config
import { IconDownload, IconSearch } from "@tabler/icons-react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type Report = {
    id: string;
    title: string;
    reportedAt: string;
    reportedBy: string;
    reason: string;
};

const Reports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const snapshot = await getDocs(collection(db, "reports"));
                const data = snapshot.docs.map((doc) => {
                    const d = doc.data();
                    return {
                        id: doc.id,
                        title: d.title,
                        reportedBy: d.reportedBy,
                        reason: d.reason,
                        reportedAt: d.reportedAt
                            ? d.reportedAt.toDate().toLocaleString()
                            : "",
                    };
                }) as Report[];

                setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Reports</h1>
                <Button variant="default" size="sm">
                    <IconDownload className="mr-2 h-4 w-4" /> Export All
                </Button>
            </div>

            {/* Search */}
            <div className="mb-6 w-full md:w-1/2 relative">
                <Input placeholder="Search reports..." className="pr-10" />
                <IconSearch className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            {/* Reports Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Reports</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 text-center">Loading...</div>
                    ) : reports.length === 0 ? (
                        <div className="p-6 text-center">No reports found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Reported At</TableHead>
                                        <TableHead>Reported By</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell title={report.id}>
                                                {report.id.length > 8
                                                    ? `${report.id.slice(
                                                          0,
                                                          12
                                                      )}...`
                                                    : report.id}
                                            </TableCell>
                                            <TableCell>
                                                {report.title}
                                            </TableCell>
                                            <TableCell>
                                                {report.reportedAt}
                                            </TableCell>
                                            <TableCell>
                                                {report.reportedBy}
                                            </TableCell>
                                            <TableCell>
                                                {report.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
