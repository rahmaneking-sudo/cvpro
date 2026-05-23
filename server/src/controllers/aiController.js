import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Dynamic import to avoid @napi-rs/canvas crash on Vercel serverless
let pdfParse;
async function getPdfParse() {
  if (!pdfParse) {
    try {
      pdfParse = require('pdf-parse');
    } catch (e) {
      // Fallback: pdf-parse v2 may fail on serverless due to @napi-rs/canvas
      console.warn('pdf-parse native load failed, using basic text extraction');
      pdfParse = null;
    }
  }
  return pdfParse;
}

export async function scanCV(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun document fourni.' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    let textContent = '';
    let isImage = false;
    let base64Image = '';

    if (mimeType === 'application/pdf') {
      const parser = await getPdfParse();
      if (!parser) {
        return res.status(500).json({ error: 'Le parsing PDF n\'est pas disponible dans cet environnement.' });
      }
      const pdfData = await parser(fileBuffer);
      textContent = pdfData.text;
    } else if (mimeType.startsWith('image/')) {
      isImage = true;
      base64Image = fileBuffer.toString('base64');
    } else {
      return res.status(400).json({ error: 'Format non supporté. Veuillez utiliser un PDF ou une Image.' });
    }

    const systemPrompt = `Tu es une IA experte en Ressources Humaines. 
Ton objectif est d'extraire les informations d'un CV et de les structurer en JSON EXACTEMENT selon le format suivant. Ne renvoie QUE le JSON, sans aucun markdown ni texte avant ou après.

Format JSON attendu :
{
  "fullName": "Nom Complet",
  "jobTitle": "Titre du poste (déduit si non explicite)",
  "summary": "Un résumé professionnel généré de 3-4 phrases basé sur le profil",
  "email": "email",
  "phone": "téléphone",
  "location": "ville, pays",
  "linkedin": "lien linkedin",
  "skills": ["compétence 1", "compétence 2"],
  "languages": ["langue 1", "langue 2"],
  "experiences": [
    {
      "company": "Nom Entreprise",
      "position": "Poste",
      "startDate": "Mois Année",
      "endDate": "Mois Année ou Présent",
      "description": "Description des missions"
    }
  ],
  "educations": [
    {
      "institution": "École",
      "degree": "Diplôme",
      "startDate": "Année",
      "endDate": "Année",
      "description": "Détails"
    }
  ]
}

Si une information est manquante, mets une chaîne vide "" ou un tableau vide [].`;

    let result;
    if (isImage) {
      const imageParts = [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        }
      ];
      result = await model.generateContent([systemPrompt, { text: "Voici le CV sous forme d'image. Extrait les informations en JSON." }, ...imageParts]);
    } else {
      result = await model.generateContent([systemPrompt, { text: `Voici le contenu brut extrait du PDF du CV :\n\n${textContent}` }]);
    }

    let responseText = result.response.text();
    // Au cas où le modèle renverrait quand même des balises markdown malgré le mimetype JSON
    responseText = responseText.replace(/```json\n?/, '').replace(/```\n?/, '');

    const parsedData = JSON.parse(responseText);

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse du document par l\'IA.' });
  }
}

export async function enhanceCVData(req, res) {
  try {
    const { cvData } = req.body;
    
    if (!cvData) {
      return res.status(400).json({ error: 'Données du CV manquantes.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `Tu es un expert en recrutement et rédaction de CV avec 20 ans d'expérience. 
Ton objectif est d'améliorer la qualité rédactionnelle d'un profil professionnel. 
Voici les données JSON d'un CV.
Améliore le résumé professionnel ('summary') et la description de chaque expérience professionnelle ('experiences').
RÈGLES STRICTES:
- Rends le texte plus professionnel, percutant et axé sur les résultats.
- Utilise des verbes d'action forts.
- Ne JAMAIS inventer de nouvelles expériences, diplômes ou compétences qui ne sont pas dans le texte d'origine.
- Conserve les mêmes dates, noms d'entreprise et structures.
- Ne touche pas aux autres champs (email, téléphone, adresse, etc.).
- Renvoie EXACTEMENT la même structure JSON avec les champs 'summary' et 'experiences' mis à jour.
Ne renvoie QUE le JSON, sans aucun markdown.`;

    const result = await model.generateContent([
      systemPrompt, 
      { text: `Voici les données du CV en JSON à améliorer :\n\n${JSON.stringify(cvData, null, 2)}` }
    ]);

    let responseText = result.response.text();
    responseText = responseText.replace(/```json\n?/, '').replace(/```\n?/, '');

    const enhancedData = JSON.parse(responseText);

    res.json({ success: true, enhancedData });
  } catch (error) {
    console.error('Enhance CV Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'amélioration du CV par l\'IA.' });
  }
}
