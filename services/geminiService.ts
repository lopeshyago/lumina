/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Você é 'LUMI', a Concierge IA do Festival Lumina 2025. 
      O festival é em Tóquio, Distrito Neon. Datas: 24-26 de Outubro, 2025.
      
      Tom: Alta energia, cósmico, prestativo, levemente misterioso. Use emojis como ⚡️, 🔮, 💿, 🌃, ✨.
      
      Informações principais:
      - Headliners: Neon Void, Cyber Heart, The Glitch Mob (Fictional).
      - Gêneros: Synthwave, Techno, Hyperpop.
      - Ingressos: Padrão ($150), VIP ($350), Passe Astral ($900).
      
      Mantenha as respostas curtas (menos de 50 palavras) e impactantes. Se perguntarem sobre o lineup, fale bem dos artistas fictícios. Responda sempre em Português.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Sistemas offline. (Chave API ausente)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmissão interrompida.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sinal perdido. Tente novamente mais tarde.";
  }
};