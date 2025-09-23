export interface Comment {
    id: string;
    text: string;
    createdBy: {
        uid: string;
        fullname: string;
        profilePicture?: string;
    };
    createdAt: any;
    likes?: Likes[];
    replies?: Replies[];
}
export interface Replies {
    id: string;
    text: string;
    createdBy: {
        uid: string;
        fullname: string;
        profilePicture?: string;
    };
    createdAt: any;
}
export interface Likes {
    id: string;
    text: string;
    createdBy: {
        uid: string;
        fullname: string;
        profilePicture?: string;
    };
    createdAt: any;
}

export interface Spark {
    id: string;
    title: string;
    content: string;
    category: string;
    createdBy: {
        uid: string;
        email: string | null;
        fullname: string;
        profilePicture: string;
    };
    createdAt: any;
    likes: Likes[];
    comments: Comment[];
}
