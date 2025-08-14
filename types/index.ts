export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};


export interface FirebaseAuthError {
  code?: string;
  message?: string;
}