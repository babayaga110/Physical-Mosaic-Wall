
import { GoogleGenAI } from "@google/genai";

export const transformToMosaic = async (base64Image: string): Promise<string> => {
  // Always create a new GoogleGenAI instance right before the API call to ensure current environment variables are used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';
  const data = base64Image.split(',')[1];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType,
          },
        },
        {
          text: "Transform this image into a beautiful physical mosaic wall art piece. The result should look like it is made of thousands of small, glossy, artistic tiles or stones. Maintain the original composition and colors but apply a distinct mosaic texture suitable for high-end home decor. Output only the transformed image.",
        },
      ],
    },
  });

  // Iterate through all parts of the response candidates to find the image part, as recommended by guidelines
  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Failed to generate mosaic image");
};
