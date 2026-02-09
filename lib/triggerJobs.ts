import { client } from "./trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// LLM Node Task
client.defineJob({
    id: "llm-node-execution",
    name: "Execute LLM Node",
    version: "1.0.0",
    trigger: eventTrigger({
        name: "llm.execute",
    }),
    run: async (payload, io, ctx) => {
        const { systemPrompt, userMessage, images, model } = payload;

        await io.logger.info("Starting LLM execution", { model });

        try {
            const selectedModel = genAI.getGenerativeModel({
                model: model || "gemini-1.5-pro"
            });

            let prompt = userMessage;
            if (systemPrompt) {
                prompt = `${systemPrompt}\n\n${userMessage}`;
            }

            const result = await selectedModel.generateContent(prompt);
            const response = result.response.text();

            await io.logger.info("LLM execution completed");

            return {
                output: response,
                success: true
            };
        } catch (error: any) {
            await io.logger.error("LLM execution failed", { error: error.message });
            return {
                error: error.message,
                success: false
            };
        }
    },
});

// Crop Image Task (FFmpeg simulation)
client.defineJob({
    id: "crop-image-execution",
    name: "Crop Image with FFmpeg",
    version: "1.0.0",
    trigger: eventTrigger({
        name: "crop.execute",
    }),
    run: async (payload, io, ctx) => {
        const { imageUrl, xPercent, yPercent, widthPercent, heightPercent } = payload;

        await io.logger.info("Starting image crop", { imageUrl });

        try {
            // Simulate FFmpeg processing
            await io.wait("processing", 2);

            // In real implementation, this would:
            // 1. Download image from imageUrl
            // 2. Run FFmpeg crop command
            // 3. Upload result to Transloadit
            // 4. Return new URL

            const croppedUrl = `${imageUrl}?crop=${xPercent},${yPercent},${widthPercent},${heightPercent}`;

            await io.logger.info("Image crop completed");

            return {
                output: croppedUrl,
                success: true
            };
        } catch (error: any) {
            await io.logger.error("Crop failed", { error: error.message });
            return {
                error: error.message,
                success: false
            };
        }
    },
});

// Extract Frame Task (FFmpeg simulation)
client.defineJob({
    id: "extract-frame-execution",
    name: "Extract Frame from Video with FFmpeg",
    version: "1.0.0",
    trigger: eventTrigger({
        name: "frame.execute",
    }),
    run: async (payload, io, ctx) => {
        const { videoUrl, timestamp } = payload;

        await io.logger.info("Starting frame extraction", { videoUrl, timestamp });

        try {
            // Simulate FFmpeg processing
            await io.wait("processing", 2);

            // In real implementation, this would:
            // 1. Download video from videoUrl
            // 2. Run FFmpeg frame extraction at timestamp
            // 3. Upload result to Transloadit
            // 4. Return frame URL

            const frameUrl = `${videoUrl}?frame=${timestamp}`;

            await io.logger.info("Frame extraction completed");

            return {
                output: frameUrl,
                success: true
            };
        } catch (error: any) {
            await io.logger.error("Frame extraction failed", { error: error.message });
            return {
                error: error.message,
                success: false
            };
        }
    },
});
