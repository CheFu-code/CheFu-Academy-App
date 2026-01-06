interface Chapter {
    topic: string;
    explain?: string;
    code?: string;
    example?: string;
}

export interface Chapters {
    content: Chapter[];
}