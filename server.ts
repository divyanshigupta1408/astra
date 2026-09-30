import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `
You are "Vanavriddhi Mitra", an AI-powered advisory assistant for the Ministry of Tribal Affairs (Government of India).
Your sole purpose is to provide clear, helpful information about Government Scholarships and Fellowships for Scheduled Tribe (ST) students.

STRICT GUARDRAILS & OPERATIONAL BOUNDARIES:
1. Answer ONLY questions related to Scheduled Tribe (ST) scholarships, fellowships, eligibility criteria, documentation, DBT, and application procedures.
2. ALWAYS cite the specific guideline clause from the knowledge base (e.g., "Under PMS-ST Guidelines Clause 5.2...", "According to NFHET Clause 2.1...").
3. NEVER declare final eligibility for a user. Always state: "Final eligibility is determined deterministically by statutory rules. Please run the Eligibility Checker tool in the portal to evaluate your exact profile."
4. If a question is outside ST educational schemes or if you are unsure about any fact, explicitly say: "I am not sure, please contact your nodal officer or district tribal development office."
5. Adhere to the core principle: "AI assists, rules decide, humans approve."
6. Respond in the user's requested language (English or Hindi).
`;

const KNOWLEDGE_BASE_CONTEXT = `
OFFICIAL SCHEMES KNOWLEDGE SNIPPETS:
1. Post-Matric Scholarship for ST Students (PMS-ST):
- Guideline Ref: Guidelines 2021-22, Clause 4.1 & Clause 5.2
- Eligibility: ST category, Class 11 to Post-Graduate/Doctoral courses.
- Income Ceiling: Family income must not exceed ₹2,50,000 per annum (Clause 5.2).
- Academic: Must have passed previous qualifying exam (min 45% or state pass mark).
- Benefits: Full compulsory non-refundable fees reimbursed + monthly maintenance allowance (Hosteller up to ₹1,200/mo, Day Scholar up to ₹550/mo).
- Bank requirement: Individual student bank account must be Aadhaar-seeded on NPCI mapper.

2. National Fellowship for Higher Education of ST Students (NFHET):
- Guideline Ref: Revised NFHET Guidelines 2022, Clause 2.1 & Clause 6.3
- Target: Full-time M.Phil and Ph.D. scholars in recognized Indian Universities.
- Total slots: 750 fresh fellowships annually (selection on merit).
- Income Ceiling: ₹6,00,000 per annum (Clause 6.3).
- Merit: Minimum 50% marks in Post-Graduation.
- Benefits: JRF ₹31,000/month, SRF ₹35,000/month + HRA + annual contingency (₹10,000 for Humanities/Social Sciences, ₹20,500 for Science & Tech).

3. Top Class Education for ST Students:
- Guideline Ref: Top Class Scheme Guidelines 2021, Clause 1.2 & Clause 9.1
- Target: ST students admitted to notified Institutes of Excellence (IITs, IIMs, AIIMS, NITs, NLUs, etc.).
- Income Ceiling: ₹6,00,000 per annum (Clause 1.2).
- Benefits: Full tuition fees + living allowance ₹2,220/month + books & stationery ₹3,000/year + one-time computer grant up to ₹45,000.

4. National Overseas Scholarship for ST Candidates (NOS):
- Guideline Ref: NOS Guidelines 2022-23, Clause 7.1 & Clause 8.4
- Target: Masters and Ph.D. abroad in accredited QS top 1000 foreign universities.
- Income Ceiling: Total family income <= ₹6,00,000 per annum.
- Merit: Minimum 55% in qualifying Bachelor/Master degree.
- Age: Below 35 years as on 1st July of selection year.

5. Pre-Matric Scholarship for ST Students (Class IX & X):
- Guideline Ref: Pre-Matric ST Guidelines 2020, Clause 3.1 & Clause 3.2
- Target: Students studying in regular classes IX and X in government/aided schools.
- Income Ceiling: ₹2,50,000 per annum.
- Benefits: Day scholars ₹225/mo + grant ₹750/yr; Hostellers ₹525/mo + grant ₹1,000/yr.
`;

app.post('/api/ai-assistant', async (req, res) => {
  const { question, language = 'en' } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `
Language: ${language === 'hi' ? 'Hindi' : 'English'}
System Context:
${SYSTEM_INSTRUCTION}

Knowledge Base:
${KNOWLEDGE_BASE_CONTEXT}

User Query: "${question}"

Please provide an accurate, helpful response adhering strictly to the guardrails, citing guideline clauses, and reminding them that final eligibility comes from the deterministic rule engine.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        if (response && response.text) {
          return res.json({ text: response.text });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next:`, err?.message || err);
      }
    }

    throw lastError || new Error('All models failed to generate response');
  } catch (err: any) {
    console.error('Gemini error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate response', details: err?.message || String(err) });
  }
});

// In production, serve built static files. In development, mount Vite middleware.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
