import OpenAI from 'openai';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function scanCV(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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
      const pdfData = await pdfParse(fileBuffer);
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

    let messages = [
      { role: "system", content: systemPrompt }
    ];

    if (isImage) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "Voici le CV sous forme d'image. Extrait les informations en JSON." },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: `Voici le contenu brut extrait du PDF du CV :\n\n${textContent}`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse du document par l\'IA.' });
  }
}
