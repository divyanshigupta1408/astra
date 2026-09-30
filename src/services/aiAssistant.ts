import { SCHEMES_DATABASE } from '../data/schemes';

const SYSTEM_INSTRUCTION = `
You are "A.S.T.R.A Mitra", an AI-powered advisory assistant for the Ministry of Tribal Affairs (Government of India).
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

export async function askAiAssistant(question: string, language: 'en' | 'hi' = 'en'): Promise<string> {
  try {
    const res = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.text) {
        return data.text.trim();
      }
    }
  } catch (err) {
    console.warn('Backend assistant request failed, switching to deterministic knowledge engine fallback:', err);
  }

  // Deterministic Grounded Knowledge Base Fallback
  return generateDeterministicKnowledgeResponse(question, language);
}

function generateDeterministicKnowledgeResponse(question: string, language: 'en' | 'hi'): string {
  const q = question.toLowerCase();

  // Out of scope / guardrail check
  if (
    q.includes('weather') || 
    q.includes('cricket') || 
    q.includes('movie') || 
    q.includes('bitcoin') || 
    q.includes('stock market') ||
    q.includes('who are you')
  ) {
    return language === 'hi'
      ? 'मैं A.S.T.R.A सहायक हूँ। मैं केवल जनजातीय कार्य मंत्रालय (MoTA) की एसटी छात्रवृत्ति व फैलोशिप योजनाओं पर जानकारी प्रदान करता हूँ। अन्य विषयों के लिए कृपया अपने नोडल अधिकारी से संपर्क करें।'
      : 'I am the A.S.T.R.A Assistant. I only answer inquiries related to Ministry of Tribal Affairs (MoTA) scholarships and fellowships for Scheduled Tribe (ST) students. For other matters, please contact your nodal officer.';
  }

  // Eligibility declaration guardrail
  if (q.includes('am i eligible') || q.includes('kya main eligible') || q.includes('kya mujhe milegi') || q.includes('will i get')) {
    return language === 'hi'
      ? 'मार्गदर्शन सिद्धांत के अनुसार: "एआई सहायता करता है, नियम निर्णय लेते हैं, मानव स्वीकृति देते हैं।" एआई अंतिम पात्रता तय नहीं करता। अपनी सटीक पात्रता जांचने के लिए कृपया पोर्टल पर "पात्रता जांचकर्ता (Eligibility Checker)" फॉर्म भरें, जो दिशानिर्देश धाराओं के आधार पर पूर्ण नियम ट्रेस प्रदान करता है।'
      : 'Per our core principle: "AI assists, rules decide, humans approve." The AI assistant never declares final eligibility. To verify if you qualify, please use the "Eligibility Checker" in the portal. It executes a deterministic rule engine and generates full guideline clause traces.';
  }

  // Income ceiling query
  if (q.includes('income') || q.includes('aay') || q.includes('ceiling') || q.includes('limit') || q.includes('सीमा')) {
    return language === 'hi'
      ? 'आय सीमा संबंधी दिशानिर्देश:\n• पोस्ट-मैट्रिक (PMS-ST): वार्षिक पारिवारिक आय अधिकतम ₹2,50,000 [धारा 5.2]\n• नेशनल फैलोशिप (NFHET - M.Phil/Ph.D): अधिकतम ₹6,00,000 [धारा 6.3]\n• टॉप क्लास शिक्षा (IITs/NITs/AIIMS): अधिकतम ₹6,00,000 [धारा 1.2]\n• नेशनल ओवरसीज (NOS): अधिकतम ₹6,00,000 [धारा 7.1]\n• प्री-मैट्रिक (कक्षा 9-10): अधिकतम ₹2,50,000 [धारा 3.2]\nनोट: आय प्रमाण पत्र सक्षम राजस्व प्राधिकारी (तहसीलदार / एसडीएम) द्वारा जारी होना अनिवार्य है।'
      : 'Statutory Income Ceilings:\n• Post-Matric Scholarship (PMS-ST): Annual family income ceiling is ₹2,50,000 [Clause 5.2].\n• National Fellowship (NFHET - M.Phil/PhD): Ceiling is ₹6,00,000 [Clause 6.3].\n• Top Class Education (IITs/IIMs/AIIMS): Ceiling is ₹6,00,000 [Clause 1.2].\n• National Overseas Scholarship (NOS): Ceiling is ₹6,00,000 [Clause 7.1].\n• Pre-Matric Scholarship (Class 9-10): Ceiling is ₹2,50,000 [Clause 3.2].\nNote: The income certificate must be issued by a competent revenue authority (Tahsildar/SDM).';
  }

  // Documents required query
  if (q.includes('document') || q.includes('kagaz') || q.includes('certificate') || q.includes('praman patra') || q.includes('दस्तावेज')) {
    return language === 'hi'
      ? 'अनिवार्य सत्यापन दस्तावेज़ (धारा 8):\n1. सक्षम प्राधिकारी द्वारा जारी वैध एसटी जाति प्रमाण पत्र (डिजिटल बारकोड / डिजिलॉकर मान्य)\n2. चालू वित्तीय वर्ष का आय प्रमाण पत्र (अधिकतम सीमा के भीतर)\n3. अंतिम उत्तीर्ण परीक्षा की अंकतालिका (Marksheet)\n4. छात्र के स्वयं के बैंक खाते की पासबुक (जो आधार से एनपीसीआई मैपर पर सक्रिय हो)\n5. उच्च शिक्षा / फैलोशिप हेतु संस्थान प्रवेश पत्र या आवंटन आदेश।'
      : 'Mandatory Verification Documents:\n1. Valid ST Caste Certificate issued by Competent Authority (Sub-Divisional Magistrate / Tahsildar with barcode/DigiLocker verification).\n2. Current Financial Year Income Certificate within scheme limits.\n3. Previous qualifying examination marksheet.\n4. Bank Passbook copy for an individual bank account seeded with Aadhaar on NPCI mapper.\n5. Admission allotment letter / fee receipt for higher education/fellowships.';
  }

  // NFHET / Fellowship query
  if (q.includes('nfhet') || q.includes('fellowship') || q.includes('phd') || q.includes('mphil') || q.includes('research')) {
    return language === 'hi'
      ? 'नेशनल फैलोशिप फॉर हायर एजुकेशन (NFHET) [धारा 2.1 व 6.3]:\n• यह पूर्णकालिक एम.फिल और पीएच.डी. करने वाले एसटी छात्रों हेतु है। प्रतिवर्ष 750 नई फैलोशिप दी जाती हैं।\n• छात्रवृत्ति दर: जेआरएफ (JRF) ₹31,000/माह, एसआरएफ (SRF) ₹35,000/माह + एचआरए + वार्षिक आकस्मिक अनुदान (₹10,000 से ₹20,500)।\n• पात्रता: पीजी में न्यूनतम 50% अंक एवं परिवार की वार्षिक आय ₹6,00,000 तक।\nकृपया विस्तृत नियम ट्रेस देखने के लिए पात्रता जांचकर्ता का उपयोग करें।'
      : 'National Fellowship for Higher Education of ST Students (NFHET) [Clause 2.1 & 6.3]:\n• Provides financial support for regular, full-time M.Phil and Ph.D. degrees in Indian universities (750 fresh slots annually).\n• Fellowship Rate: ₹31,000/month (JRF) or ₹35,000/month (SRF) + HRA + contingency (₹10,000/yr for Humanities, ₹20,500/yr for Science/Engg).\n• Criteria: PG with minimum 50% marks, annual family income <= ₹6.00 Lakhs.\nPlease check the Eligibility Checker in the portal for your exact profile.';
  }

  // Top Class query
  if (q.includes('top class') || q.includes('iit') || q.includes('nit') || q.includes('aiims') || q.includes('iim')) {
    return language === 'hi'
      ? 'टॉप क्लास एजुकेशन योजना (Top Class Education) [धारा 1.2 एवं 9.1]:\n• यह भारत सरकार द्वारा अधिसूचित 250+ उत्कृष्ट संस्थानों (आईआईटी, एनआईटी, आईआईएम, एम्स, एनएलयू) में अध्ययनरत एसटी छात्रों के लिए है।\n• लाभ: संपूर्ण शिक्षण शुल्क की प्रतिपूर्ति + निर्वाह भत्ता ₹2,220/माह + पुस्तकें ₹3,000/वर्ष + कंप्यूटर हेतु ₹45,000 एकमुश्त सहायता।\n• आय सीमा: अधिकतम ₹6,00,000 वार्षिक।'
      : 'Top Class Education for ST Students [Clause 1.2 & 9.1]:\n• Covers ST students admitted into notified premier institutions (IITs, NITs, IIMs, AIIMS, NLUs, etc.).\n• Benefits: 100% full tuition fee reimbursement + living allowance ₹2,220/month + book grant ₹3,000/yr + latest computer/laptop grant up to ₹45,000.\n• Income Limit: Family income <= ₹6,00,000 per annum.';
  }

  // Bank seeding / DBT query
  if (q.includes('bank') || q.includes('dbt') || q.includes('npci') || q.includes('aadhaar') || q.includes('seeding') || q.includes('खाता')) {
    return language === 'hi'
      ? 'डीबीटी एवं बैंक सीडिंग दिशानिर्देश:\nभारत सरकार के प्रत्यक्ष लाभ अंतरण (DBT) नियमों के तहत छात्रवृत्ति केवल आधार-सीडेड बैंक खाते में पीएफएमएस (PFMS) के माध्यम से हस्तांतरित की जाती है। यदि आपका खाता केवल आधार से लिंक है परंतु एनपीसीआई मैपर (NPCI Mapper) पर सीडेड नहीं है, तो भुगतान अस्वीकृत हो सकता है। कृपया अपनी बैंक शाखा में जाकर "Aadhaar Seeding Mandate" जमा कराएं।'
      : 'DBT & Bank Seeding Mandates:\nUnder Govt of India Direct Benefit Transfer (DBT) guidelines, scholarships are disbursed exclusively via PFMS to individual accounts mapped on the NPCI Aadhaar Mapper. Simple mobile linking or basic KYC is NOT sufficient; ensure your bank branch marks your account as "NPCI Seeded for Direct Benefit Transfer".';
  }

  // Default helpful response
  return language === 'hi'
    ? 'जनजातीय कार्य मंत्रालय (MoTA) एसटी छात्रों के लिए कई योजनाएं संचालित करता है: पोस्ट-मैट्रिक छात्रवृत्ति (PMS-ST), नेशनल फैलोशिप (NFHET), टॉप क्लास शिक्षा, नेशनल ओवरसीज (NOS) और प्री-मैट्रिक। कृपया पात्रता की जांच हेतु पोर्टल के "पात्रता जांचकर्ता" का उपयोग करें। यदि आपको किसी विशिष्ट मामले में संदेह है, तो कृपया अपने संस्थान या जिला जनजातीय विकास अधिकारी से संपर्क करें।'
    : 'The Ministry of Tribal Affairs (MoTA) provides several statutory schemes: Post-Matric Scholarship (PMS-ST), National Fellowship (NFHET), Top Class Education (IITs/AIIMS), National Overseas Scholarship (NOS), and Pre-Matric. To verify your exact eligibility with full rule trace, please use the "Eligibility Checker" in the portal. If you are unsure about a specific administrative matter, please contact your nodal officer.';
}
