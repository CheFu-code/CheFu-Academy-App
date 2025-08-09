import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

export async function sendImageWithPrompt(
    selectedImage: string,
    inputText: string,
    genAI: GoogleGenerativeAI,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (!selectedImage) return;

    setIsGenerating(true);
    try {
        const asset = await fetch(selectedImage);
        const blob = await asset.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64 = reader.result?.toString().split(",")[1];

            const userMessage: Message = {
                id: Date.now().toString(),
                text: `[img-icon] ${inputText}`,
                sender: "user",
            };
            setMessages((prev) => [...prev, userMessage]);

            const typingId = (Date.now() + 1).toString();
            setMessages((prev) => [...prev, { id: typingId, text: "", sender: "ai" }]);

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = await model.generateContent([
                    { inlineData: { mimeType: "image/jpeg", data: base64! } },
                    { text: inputText.trim() },
                ]);
                const fullText = result.response.text();
                setMessages((prev) =>
                    prev.map((msg) => (msg.id === typingId ? { ...msg, text: fullText } : msg))
                );
            } catch (err) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === typingId ? { ...msg, text: "Failed to analyze the image." } : msg
                    )
                );
            } finally {
                setIsGenerating(false);
            }
        };

        reader.readAsDataURL(blob);
    } catch (err) {
        console.error("sendImageWithPrompt error:", err);
        setIsGenerating(false);
    }
}
