import { Dispatch, ReactNode, SetStateAction } from "react";
import { UserDetail } from "./UserDetail";
import { Video } from "./video";

export interface VideoDetailUIProps {
    backgroundColor: string;
    color: string;

    safeBack: () => void;

    video: Video;

    // Favorites
    adding: boolean;
    favorite: boolean;
    handleFavorite: () => void;

    // Download
    handleDownload: () => void;
    downloading: boolean;

    // Options / Modals
    showOptions: boolean;
    setShowOptions: Dispatch<SetStateAction<boolean>>;

    showReportModal: boolean;
    setShowReportModal: (value: boolean) => void;

    showDeleteModal: {
        visible: boolean;
        title: string;
        message: string;
    };
    setShowDeleteModal: (value: {
        visible: boolean;
        title: string;
        message: string;
    }) => void;

    // Enrollment
    enrolled: boolean;
    enrolling: boolean;
    handleEnroll: () => void;

    // Report
    reporting: boolean;
    reportReason: string;
    setReportReason: (value: string) => void;
    handleReport: () => void;

    // Meta
    uploaderName: string | null;
    uploadedAtText?: string;

    // Tabs
    activeTab: "Overview" | "Reviews";
    setActiveTab: (tab: "Overview" | "Reviews") => void;
    renderTabContent: () => ReactNode;

    // Delete
    handleDeleteVideo: () => void;

    // User
    userDetail: UserDetail; 
}
