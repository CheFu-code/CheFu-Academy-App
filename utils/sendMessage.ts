import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
    senderId: string;
};

type SendMessageParams = {
    inputText: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setInputText: React.Dispatch<React.SetStateAction<string>>;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    setStopGeneration: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentTypingId: React.Dispatch<React.SetStateAction<string | null>>;
    genAI: GoogleGenerativeAI;
    userDetail: { email: string };
};

export const sendMessage = async ({
    inputText,
    setMessages,
    setInputText,
    setIsGenerating,
    setStopGeneration,
    setCurrentTypingId,
    genAI,
    userDetail,
}: SendMessageParams) => {
    if (!inputText.trim()) return;
    setIsGenerating(true);

    const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: "user",
        senderId: userDetail?.email,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const typingId = (Date.now() + 1).toString();
    const typingMessage: Message = {
        id: typingId,
        text: "",
        sender: "ai",
        senderId: "ai",
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {

        const generationConfig = {
            temperature: 0.7,
        };

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig });


        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: inputText.trim() }] }],
        });

        function cleanMarkdown(raw: string) {
            return raw
                .replace(/^```(?:markdown)?\n?/g, "")
                .replace(/```$/, "")
                .trim();
        }

        const fullText = cleanMarkdown(result.response.text());

        setCurrentTypingId(typingId);
        setStopGeneration(false);

        let displayText = "";
        const words = fullText.split(" ");

        for (const word of words) {
            if (!word) continue;
            displayText += word + " ";
            await new Promise((r) => setTimeout(r, 50));

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === typingId ? { ...msg, text: displayText } : msg
                )
            );
        }

        setIsGenerating(false);
        setCurrentTypingId(null);
    } catch (err) {
        console.error("Streaming error:", err);
        setIsGenerating(false);

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === typingId
                    ? {
                        ...msg,
                        text: "Our AI is currently overloaded. Please try again in a few seconds.",
                    }
                    : msg
            )
        );
    }
};
