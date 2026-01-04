import { Animated } from 'react-native';

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
        email?: string;
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

export interface ReplyProps {
    replyText: string;
    setReplyText: (v: string) => void;
    handleAddReply: () => void;
    replying: boolean;
}

export interface Props {
    visible: boolean;
    slideAnim: Animated.Value;
    closeReplies: () => void;
    comment: { id: string; replies?: Replies[] };
    onAddReply?: (commentId: string, reply: Replies) => void;
    sparkId: string;
}
