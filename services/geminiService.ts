import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // In a real scenario, handle missing key gracefully
    const apiKey = process.env.API_KEY || ''; 
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const consultOracle = async (question: string, contextFaction: string | null): Promise<string> => {
  try {
    const ai = getAiClient();
    const factionContext = contextFaction ? `提问者属于【${contextFaction}】阵营。` : '';
    
    // Using gemini-2.5-flash for fast responses
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `你是一个处于“堕神纪元”黑暗西幻世界观中的神秘“虚空先知”。
      世界观背景：诸神陨落，世界崩塌，堕神者、旧日贵族、禁忌学者、无光者和轮回使徒五大势力争夺残存的世界。
      请用晦涩、神秘、带有谜语人性质的语言（类似密教模拟器风格）回答用户的问题。
      ${factionContext}
      用户的提问是：${question}
      
      请限制回答在100字以内。不要直接给出答案，而是给出一个带有隐喻的启示。`,
    });

    return response.text || "虚空之中只有沉默...（无法连接到神谕）";
  } catch (error) {
    console.error("Oracle Error:", error);
    return "迷雾遮蔽了命运的轨迹...（请检查API Key或网络）";
  }
};
