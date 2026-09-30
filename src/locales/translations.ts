export interface TranslationDict {
  appTitle: string;
  appSubtitle: string;
  ministryName: string;
  corePrinciple: string;
  corePrincipleSub: string;
  demoDataBadge: string;
  roleSwitcher: {
    student: string;
    officer: string;
    analyst: string;
  };
  nav: {
    eligibility: string;
    apply: string;
    track: string;
    systemDesign: string;
    auditLog: string;
    privacy: string;
  };
  eligibility: {
    title: string;
    subtitle: string;
    stateLabel: string;
    courseLevelLabel: string;
    instituteTypeLabel: string;
    instituteNameLabel: string;
    incomeLabel: string;
    percentageLabel: string;
    genderLabel: string;
    pwdLabel: string;
    checkButton: string;
    voiceSpeak: string;
    voiceListening: string;
    voiceNotSupported: string;
    eligibleCount: string;
    nearMissCount: string;
    explainWhy: string;
    ruleTraceHeader: string;
    whatNeedsToChange: string;
    applyNow: string;
    passed: string;
    failed: string;
  };
  smartApply: {
    title: string;
    subtitle: string;
    uploadDocsHeader: string;
    casteCert: string;
    incomeCert: string;
    marksheet: string;
    bankPassbook: string;
    runOcr: string;
    ocrExtracting: string;
    extractedFields: string;
    crossDocHeader: string;
    healthScoreHeader: string;
    bankSeedingStatus: string;
    dbtReady: string;
    dbtPending: string;
    submitApplication: string;
    loadSampleMismatch: string;
    loadSampleClean: string;
  };
  tracker: {
    title: string;
    subtitle: string;
    stages: {
      submitted: string;
      instituteVerified: string;
      stateVerified: string;
      ministrySanctioned: string;
      pfmsReleased: string;
      bankCredited: string;
    };
    smsNotificationHeader: string;
    whatsappNotificationHeader: string;
  };
  officer: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    laneFilter: string;
    slaFilter: string;
    stateFilter: string;
    oldestFirst: string;
    riskLaneLabel: string;
    slaStatusLabel: string;
    advisoryNote: string;
    approve: string;
    sendBack: string;
    escalate: string;
    fraudGraphTab: string;
    delayPredictorTab: string;
  };
  analyst: {
    title: string;
    subtitle: string;
    kpiEligible: string;
    kpiApplied: string;
    kpiReach: string;
    kpiDaysToCredit: string;
    kpiRejectionRate: string;
    kpiFraudBlocked: string;
    simulatorTitle: string;
    fairnessTitle: string;
    dropoutRiskTitle: string;
  };
}

export const translations: Record<'en' | 'hi', TranslationDict> = {
  en: {
    appTitle: 'A.S.T.R.A',
    appSubtitle: 'AI-Enabled ST Scholarship & Fellowship Management System',
    ministryName: 'Ministry of Tribal Affairs • Government of India',
    corePrinciple: 'AI assists, rules decide, humans approve.',
    corePrincipleSub: 'Deterministic statutory eligibility engine with full audit traceability',
    demoDataBadge: 'Production Rule Set v3.2 • GFR 2017',
    roleSwitcher: {
      student: 'Student View',
      officer: 'Institute / State Officer',
      analyst: 'Ministry Analyst'
    },
    nav: {
      eligibility: 'Eligibility Checker',
      apply: 'Smart Application',
      track: 'Application Tracker',
      systemDesign: 'System Architecture',
      auditLog: 'Audit Log & Chains',
      privacy: 'Privacy & DPDP Act'
    },
    eligibility: {
      title: 'Deterministic Scheme Eligibility Checker',
      subtitle: 'Instant statutory pre-qualification evaluated by formal guideline rules, never an unverified LLM verdict.',
      stateLabel: 'State / UT of Domicile',
      courseLevelLabel: 'Course / Education Level',
      instituteTypeLabel: 'Institute Category',
      instituteNameLabel: 'Institute / University Name',
      incomeLabel: 'Annual Family Income (₹)',
      percentageLabel: 'Marks in Last Exam (%)',
      genderLabel: 'Gender',
      pwdLabel: 'Person with Benchmark Disability (PwD)',
      checkButton: 'Evaluate Eligibility & Generate Rule Trace',
      voiceSpeak: 'Speak Details (Voice Input)',
      voiceListening: 'Listening... say e.g. "I study PG in Odisha, income 2 lakh"',
      voiceNotSupported: 'Web Speech API is not supported in this browser. Please use keyboard input.',
      eligibleCount: 'Schemes Found Eligible',
      nearMissCount: 'Near-Miss Opportunities',
      explainWhy: 'Explain Rule Trace & Guideline Clauses',
      ruleTraceHeader: 'Statutory Verification Trace',
      whatNeedsToChange: 'Criteria required to qualify',
      applyNow: 'Proceed to Apply with AI Document Extraction',
      passed: 'Satisfied',
      failed: 'Disqualified'
    },
    smartApply: {
      title: 'Smart Application & Document Consistency Check',
      subtitle: 'Simulated OCR document ingest, automated cross-document inconsistency detector, and DBT readiness health check.',
      uploadDocsHeader: 'Upload Mandatory Verification Documents',
      casteCert: 'ST Caste Certificate',
      incomeCert: 'Income Certificate (Revenue Authority)',
      marksheet: 'Previous Examination Marksheet',
      bankPassbook: 'Bank Passbook / Cancelled Cheque',
      runOcr: 'Extract Data & Run Cross-Document Verification',
      ocrExtracting: 'Running Multi-Document OCR & Consistency Engine...',
      extractedFields: 'Extracted Profile Attributes',
      crossDocHeader: 'Cross-Document Consistency Analysis',
      healthScoreHeader: 'Application Health & Quality Score',
      bankSeedingStatus: 'Aadhaar-NPCI Bank Seeding & DBT Status',
      dbtReady: 'Active on NPCI Mapper (Direct Benefit Transfer Ready)',
      dbtPending: 'Aadhaar Not Seeded to Bank Account (DBT Rejection Risk)',
      submitApplication: 'Submit Verified Application to Institute Nodal Officer',
      loadSampleMismatch: 'Load Sample with Realistic Discrepancies (Demo)',
      loadSampleClean: 'Load Pristine Verified Sample (100% Health)'
    },
    tracker: {
      title: 'End-to-End Disbursement Tracker',
      subtitle: 'Track your application from institutional verification through PFMS treasury release to your bank account.',
      stages: {
        submitted: 'Application Submitted',
        instituteVerified: 'Institute Nodal Verified',
        stateVerified: 'State Department Approved',
        ministrySanctioned: 'MoTA Sanction Order Issued',
        pfmsReleased: 'Released via PFMS Treasury',
        bankCredited: 'DBT Credited to Bank Account'
      },
      smsNotificationHeader: 'Official MoTA SMS Alert (Preview)',
      whatsappNotificationHeader: 'Official WhatsApp Notification (Bhashini-Ready)'
    },
    officer: {
      title: 'Institutional & State Officer Verification Triage',
      subtitle: 'Priority queue triaged by risk lanes (Green/Amber/Red) and SLA breach predictive models.',
      searchPlaceholder: 'Search by student name, application ID, institute, or state...',
      laneFilter: 'Filter by Risk Lane',
      slaFilter: 'Filter by SLA Status',
      stateFilter: 'Filter State',
      oldestFirst: 'Sort: Oldest Pending First',
      riskLaneLabel: 'Risk Lane',
      slaStatusLabel: 'SLA Health',
      advisoryNote: 'Statutory Safeguard: AI flag is advisory. Officer decision is final.',
      approve: 'Approve & Forward to State Level',
      sendBack: 'Send Back for Student Correction',
      escalate: 'Escalate to District Vigilance',
      fraudGraphTab: 'Syndicate Fraud Graph',
      delayPredictorTab: 'SLA Delay Predictor'
    },
    analyst: {
      title: 'Ministry Executive Dashboard & Policy Analytics',
      subtitle: 'Macro-level tracking of scheme reach, equity indicators, PVTG coverage, and interactive policy simulators.',
      kpiEligible: 'Estimated Eligible ST Youth',
      kpiApplied: 'Total Active Applications',
      kpiReach: 'Scheme Reach Coverage',
      kpiDaysToCredit: 'Avg. Turnaround (Days to Credit)',
      kpiRejectionRate: 'Rejection Rate',
      kpiFraudBlocked: 'Prevented Synergistic Fraud (₹ Cr)',
      simulatorTitle: 'Interactive Fiscal & Policy Simulator',
      fairnessTitle: 'Algorithmic Fairness & Bias Audit',
      dropoutRiskTitle: 'Predictive Beneficiary Dropout Intervention Table'
    }
  },
  hi: {
    appTitle: 'ए.एस.टी.आर.ए (A.S.T.R.A)',
    appSubtitle: 'अनुसूचित जनजाति (एसटी) छात्रवृत्ति एवं फैलोशिप प्रबंधन प्रणाली',
    ministryName: 'जनजातीय कार्य मंत्रालय • भारत सरकार',
    corePrinciple: 'एआई सहायता करता है, नियम निर्णय लेते हैं, मानव स्वीकृति देते हैं।',
    corePrincipleSub: 'पूर्ण ऑडिट ट्रैसेबिलिटी के साथ औपचारिक दिशानिर्देश पात्रता इंजन',
    demoDataBadge: 'सत्यापित नियम सेट v3.2 • जीएफआर 2017',
    roleSwitcher: {
      student: 'विद्यार्थी दृश्य (Student)',
      officer: 'संस्थान / राज्य नोडल अधिकारी',
      analyst: 'मंत्रालय नीति विश्लेषक'
    },
    nav: {
      eligibility: 'पात्रता जांचकर्ता (Eligibility)',
      apply: 'स्मार्ट आवेदन एवं दस्तावेज़',
      track: 'आवेदन स्थिति ट्रैकर',
      systemDesign: 'सिस्टम आर्किटेक्चर',
      auditLog: 'ऑडिट लॉग व हैश चेन',
      privacy: 'गोपनीयता एवं डीपी Commercial अधिनियम'
    },
    eligibility: {
      title: 'नियम-आधारित योजना पात्रता जांचकर्ता',
      subtitle: 'नियमों और दिशानिर्देशों द्वारा निर्धारित तत्काल योग्यता सत्यापन।',
      stateLabel: 'मूल निवास राज्य / केंद्र शासित प्रदेश',
      courseLevelLabel: 'पाठ्यक्रम / शिक्षा स्तर',
      instituteTypeLabel: 'संस्थान की श्रेणी',
      instituteNameLabel: 'संस्थान या विश्वविद्यालय का नाम',
      incomeLabel: 'वार्षिक पारिवारिक आय (₹)',
      percentageLabel: 'अंतिम परीक्षा में प्राप्त अंक (%)',
      genderLabel: 'लिंग',
      pwdLabel: 'दिव्यांगता श्रेणी (PwD)',
      checkButton: 'पात्रता जांचें और नियम ट्रेस देखें',
      voiceSpeak: 'बोलकर जानकारी दें (Voice Input)',
      voiceListening: 'सुन रहे हैं... जैसे बोलें: "मैं ओडिशा में पीजी कर रहा हूँ, आय दो लाख"',
      voiceNotSupported: 'इस ब्राउज़र में ध्वनि इनपुट उपलब्ध नहीं है। कृपया कीबोर्ड का उपयोग करें।',
      eligibleCount: 'पात्र पाई गई योजनाएं',
      nearMissCount: 'निकट-अवसर योजनाएं (Near-Miss)',
      explainWhy: 'नियम ट्रेस व दिशानिर्देश धाराएं देखें',
      ruleTraceHeader: 'वैधानिक सत्यापन ट्रेस',
      whatNeedsToChange: 'पात्र बनने हेतु आवश्यक परिवर्तन',
      applyNow: 'एआई दस्तावेज़ निष्कर्षण के साथ आवेदन करें',
      passed: 'संतुष्ट',
      failed: 'अपात्र'
    },
    smartApply: {
      title: 'स्मार्ट आवेदन एवं दस्तावेज़ विसंगति जांच',
      subtitle: 'सिम्युलेटेड ओसीआर, स्वचालित क्रॉस-डॉक्यूमेंट विसंगति पहचान और डीबीटी बैंक सीडिंग जांच।',
      uploadDocsHeader: 'अनिवार्य सत्यापन दस्तावेज़ अपलोड करें',
      casteCert: 'एसटी जाति प्रमाण पत्र',
      incomeCert: 'आय प्रमाण पत्र (सक्षम प्राधिकारी)',
      marksheet: 'पूर्व परीक्षा अंकपत्र (Marksheet)',
      bankPassbook: 'बैंक पासबुक / निरस्त चेक',
      runOcr: 'डेटा निकालें और क्रॉस-डॉक्यूमेंट सत्यापन करें',
      ocrExtracting: 'मल्टी-डॉक्यूमेंट ओसीआर और विसंगति इंजन चालू है...',
      extractedFields: 'पहचाने गए छात्र विवरण',
      crossDocHeader: 'दस्तावेज़ों के मध्य विसंगति विश्लेषण',
      healthScoreHeader: 'आवेदन स्वास्थ्य एवं गुणवत्ता स्कोर',
      bankSeedingStatus: 'आधार-एनपीसीआई बैंक सीडिंग एवं डीबीटी स्थिति',
      dbtReady: 'एनपीसीआई मैपर पर सक्रिय (प्रत्यक्ष लाभ अंतरण हेतु तैयार)',
      dbtPending: 'बैंक खाते से आधार लिंक नहीं (डीबीटी अस्वीकृति का जोखिम)',
      submitApplication: 'संस्थान नोडल अधिकारी को सत्यापित आवेदन जमा करें',
      loadSampleMismatch: 'विसंगति वाला नमूना लोड करें (डेमो)',
      loadSampleClean: 'सत्यापित त्रुटिहीन नमूना लोड करें (100% स्कोर)'
    },
    tracker: {
      title: 'वितरण स्थिति ट्रैकर (End-to-End)',
      subtitle: 'संस्थागत सत्यापन से लेकर पीएफएमएस राजकोष और आपके बैंक खाते में जमा होने तक का विवरण।',
      stages: {
        submitted: 'आवेदन प्रस्तुत किया गया',
        instituteVerified: 'संस्थान नोडल द्वारा सत्यापित',
        stateVerified: 'राज्य विभाग द्वारा अनुमोदित',
        ministrySanctioned: 'मंत्रालय द्वारा स्वीकृति आदेश जारी',
        pfmsReleased: 'पीएफएमएस राजकोष द्वारा जारी',
        bankCredited: 'बैंक खाते में डीबीटी राशि जमा'
      },
      smsNotificationHeader: 'आधिकारिक एसएमएस संदेश (पूर्वावलोकन)',
      whatsappNotificationHeader: 'आधिकारिक व्हाट्सएप सूचना (भाषिणी-सक्षम)'
    },
    officer: {
      title: 'संस्थान एवं राज्य नोडल अधिकारी सत्यापन डैशबोर्ड',
      subtitle: 'जोखिम लेन (हरा/पीला/लाल) और एसएलए उल्लंघन भविष्यवाणी के आधार पर प्राथमिकता कतार।',
      searchPlaceholder: 'छात्र का नाम, आवेदन आईडी, संस्थान या राज्य से खोजें...',
      laneFilter: 'जोखिम लेन द्वारा फ़िल्टर करें',
      slaFilter: 'एसएलए स्थिति द्वारा फ़िल्टर करें',
      stateFilter: 'राज्य चुनें',
      oldestFirst: 'क्रम: सबसे पुराना लंबित पहले',
      riskLaneLabel: 'जोखिम लेन',
      slaStatusLabel: 'एसएलए स्वास्थ्य',
      advisoryNote: 'वैधानिक सुरक्षा: एआई सुझाव केवल सलाहकार है। अधिकारी का निर्णय अंतिम है।',
      approve: 'स्वीकृत करें और राज्य को भेजें',
      sendBack: 'छात्र को सुधार हेतु वापस भेजें',
      escalate: 'जिला सतर्कता प्रकोष्ठ को अग्रेषित करें',
      fraudGraphTab: 'संगठित धोखाधड़ी नेटवर्क ग्राफ',
      delayPredictorTab: 'विलंब पूर्वानुमान (Delay Predictor)'
    },
    analyst: {
      title: 'मंत्रालय विश्लेषक डैशबोर्ड एवं नीति विश्लेषिकी',
      subtitle: 'योजना पहुंच, समानता सूचकांक, पीवीटीजी आच्छादन और इंटरएक्टिव नीति सिम्युलेटर का राष्ट्रीय दृश्य।',
      kpiEligible: 'अनुमानित पात्र एसटी युवा',
      kpiApplied: 'कुल सक्रिय आवेदन',
      kpiReach: 'योजना पहुंच प्रतिशत',
      kpiDaysToCredit: 'औसत वितरण अवधि (दिन)',
      kpiRejectionRate: 'अस्वीकृति दर',
      kpiFraudBlocked: 'रोकी गई संदिग्ध धोखाधड़ी राशि (₹ करोड़)',
      simulatorTitle: 'नीति एवं बजट सिम्युलेटर',
      fairnessTitle: 'एल्गोरिथम निष्पक्षता एवं पूर्वाग्रह ऑडिट',
      dropoutRiskTitle: 'शिक्षा त्याग (ड्रॉपआउट) जोखिम तालिका व संरक्षक आवंटन'
    }
  }
};
