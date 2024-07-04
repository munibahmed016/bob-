import { Flow } from "../types/Flow";
import { Params } from "../types/Params";
import { getOpenAIResponse } from "./openaiService";

const systemMessage = "You are a helpful and friendly chatbot.";

export async function handleUserMessage(params: Params, message: string) {
    const response = await getOpenAIResponse(message, systemMessage);
   if (response !== null){
    await params.injectMessage(response);
   }else{
        console.error("Null Response from OpenAi");
   }
}

export const defaultFlow: Flow = {
    start: {
        message: "Hello, I am a friendly chatbot! How can I help you today?",
        path: "handleUserInput",
    },
    handleUserInput: {
        message: async (params: Params) => {
            await handleUserMessage(params, params.userInput);
            return ""; // Return an empty string to continue the same path
        },
        path: "handleUserInput",
    },
};

// boolean indicating if user is on desktop (otherwise treated as on mobile)
export const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

/**
 * Parses message that has markup enabled (holds html tags as individual elements to enable smooth streaming).
 * 
 * @param message message to parse
 */
export const parseMarkupMessage = (message: string) => {
    const result: string[] = [];
    let currentTag = "";
    let isInTag = false;

    for (let i = 0; i < message.length; i++) {
        const char = message[i];

        if (char === "<") {
            // detects start of html tag
            if (!isInTag) {
                isInTag = true;
                currentTag = char;
            } else {
                result.push(currentTag);
                currentTag = char;
            }
        } else if (char === ">") {
            // detects end of html tag
            currentTag += char;
            result.push(currentTag);
            currentTag = "";
            isInTag = false;
        } else {
            // handles normal character 
            if (isInTag) {
                currentTag += char;
            } else {
                result.push(char);
            }
        }
    }
  
    if (currentTag !== "") {
        result.push(currentTag);
    }
    return result;
}

/**
 * Checks if chatbot is visible (uses chatbot body as reference).
 * 
 * @param element chatbot body used to gauge visibility
 */
export const isChatBotVisible = (element: HTMLDivElement) => {
    if (!element) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowHeight &&
        rect.right <= windowWidth
    );
}

/**
 * Retrieves details of a file (only for image, video and audio) which consists of its type and URL.
 *
 * @param file file object to get details from
 */
export const getMediaFileDetails = async (file: File): Promise<{ fileType: string | null, fileUrl: string | null }> => {
    if (!file) {
        return { fileType: null, fileUrl: null };
    }

    const fileType = file.type.split('/')[0];

    if (!["image", "video", "audio"].includes(fileType)) {
        return { fileType: null, fileUrl: null };
    }

    try {
        const fileUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("File reading failed"));
            reader.readAsDataURL(file);
        });

        return { fileType, fileUrl };
    } catch (error) {
        return { fileType: null, fileUrl: null };
    }
};
