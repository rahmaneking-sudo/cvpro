import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '../server/.env' });

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = "Tu es une IA experte. Renvoie un JSON simple.";
    const textContent = "Voici mon CV : Développeur web";

    console.log("Testing text generation...");
    // This is exactly how it is in aiController.js
    const result = await model.generateContent([
        systemPrompt, 
        { text: `Voici le contenu brut extrait du PDF du CV :\n\n${textContent}` }
    ]);
    
    console.log("Result:");
    console.log(result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
