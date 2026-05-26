import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./server/.env') });

async function testDynamicGemini() {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent([
      "Tu es un assistant",
      { text: "Dis coucou" }
    ]);
    
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

testDynamicGemini();
