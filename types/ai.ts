// types/ai.ts

export interface ContentPart {
  text: string;
}

export interface Content {
  role: string;
  parts: ContentPart[];
}

export interface Candidate {
  content?: {
    parts?: ContentPart[];
  };
}

export interface GenerateContentResponse {
  candidates?: Candidate[];
}
