import React from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { 
  FolderCheck, 
  FileCheck2, 
  AlertTriangle, 
  Download, 
  Eye, 
  Upload, 
  ShieldCheck, 
  Calendar, 
  Lock, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface StudentDocumentsTabProps {
  user: AuthUser;
  language: AppLanguage;
}

export const StudentDocumentsTab: React.FC<StudentDocumentsTabProps> = ({ user, language }) => {
  const isMeena = user.identifier === '9876543210' || user.id === 'USR-STU-MEENA';

  const documents = [
    {
      id: 'doc-01',
      titleHi: 'अनुसूचित जनजाति (ST) जाति प्रमाण पत्र',
      titleEn: 'Scheduled Tribe Caste Certificate',
      authority: isMeena ? 'Sub-Divisional Magistrate, Dantewada' : 'Sub-Divisional Magistrate, Baripada',
      docNumber: isMeena ? 'CG/DTW/ST/2023/18290' : 'OD/MBJ/ST/2022/49102',
      status: 'verified',
      issuedDate: isMeena ? '10 May 2023' : '14 Jun 2022',
      expiryDate: 'Lifetime Validity (Art. 342)',
      fileSize: '1.4 MB',
      pkiHash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      isExpiringSoon: false
    },
    {
      id: 'doc-02',
      titleHi: 'सक्षम राजस्व आय प्रमाण पत्र',
      titleEn: 'Revenue Authority Income Certificate',
      authority: isMeena ? 'Tahsildar, Kuakonda (Dantewada)' : 'Tahsildar, Mayurbhanj',
      docNumber: isMeena ? 'CG/REV/INC/2026/0921' : 'OD/REV/INC/2026/4102',
      status: 'verified',
      issuedDate: '15 Apr 2026',
      expiryDate: '31 March 2027 (FY 2026-27)',
      fileSize: '950 KB',
      pkiHash: 'SHA256: 3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1',
      isExpiringSoon: false
    },
    {
      id: 'doc-03',
      titleHi: 'कक्षा 12वीं / वरिष्ठ माध्यमिक अंकतालिका',
      titleEn: 'Senior Secondary Class XII Board Marksheet',
      authority: isMeena ? 'CBSE / Jawahar Navodaya Vidyalaya Dantewada' : 'CHSE Odisha Board',
      docNumber: isMeena ? 'CBSE-XII-2024-419082' : 'CHSE-OD-2023-91823',
      status: 'verified',
      issuedDate: '24 May 2024',
      expiryDate: 'Permanent Academic Record',
      fileSize: '2.0 MB',
      pkiHash: 'SHA256: 120ea8a25e5d487bf68b5f7096440019dacd18e08dcdce947f12ed7e0ceb7603',
      isExpiringSoon: false
    },
    {
      id: 'doc-04',
      titleHi: 'बैंक पासबुक एवं एनपीसीआई डीबीटी मैपर जनादेश',
      titleEn: 'Bank Passbook & NPCI DBT Mandate Record',
      authority: isMeena ? 'Chhattisgarh Rajya Gramin Bank / SBI' : 'State Bank of India, Rourkela',
      docNumber: isMeena ? 'Aadhaar DBT Masked ••••8821' : 'Aadhaar DBT Masked ••••3912',
      status: 'verified',
      issuedDate: 'Active NPCI Live Ledger',
      expiryDate: 'Active & Verified',
      fileSize: '1.2 MB',
      pkiHash: 'SHA256: b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
      isExpiringSoon: false
    }
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FolderCheck className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {language === 'hi' ? 'सत्यापित डिजिटल दस्तावेज़ तिजोरी (Digital Locker Vault)' : 'Verified Document Vault & Expiry Monitor'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'hi'
              ? 'डिजीलाकर पीकेआई द्वारा सत्यापित आपके सभी 4 वैधानिक दस्तावेज़। सुरक्षित एवं छेड़छाड़-रहित।'
              : 'Cryptographically hashed documents for statutory scholarship compliance under GFR rules.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>PKI Hash Chain Intact</span>
          </span>
        </div>
      </div>

      {/* Grid of Verified Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border-2 border-amber-200 rounded-xl p-4 shadow-xs hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-stone-900 text-sm">
                  {language === 'hi' ? doc.titleHi : doc.titleEn}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <div>Issuing Body: <strong>{doc.authority}</strong></div>
                <div className="font-mono text-[11px] text-stone-500">Record #: {doc.docNumber}</div>
              </div>

              {/* Expiry Warning Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-[11px] flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Valid until: <strong>{doc.expiryDate}</strong></span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Current
                </span>
              </div>

              {/* Cryptographic Hash */}
              <div className="bg-stone-100 rounded p-1.5 font-mono text-[9px] text-stone-600 truncate">
                {doc.pkiHash}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
              <span className="text-[11px] text-stone-500 font-mono">{doc.fileSize}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Viewing document: ${doc.titleEn}`)}
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Downloading verified copy of: ${doc.titleEn}`)}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Additional Supporting Document */}
      <div className="border-2 border-dashed border-amber-300 rounded-xl p-6 bg-amber-50/50 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Upload className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-stone-900 text-xs">
          {language === 'hi' ? 'अतिरिक्त प्रमाण पत्र या हलफनामा जोड़ें' : 'Upload Additional Certificate or ITDA Affidavit'}
        </h4>
        <p className="text-[11px] text-stone-500 max-w-md mx-auto">
          {language === 'hi'
            ? 'यदि आपके पास नया आय प्रमाण पत्र या ग्राम सभा सामुदायिक हलफनामा है, तो यहां अपलोड करें।'
            : 'Upload renewal income cert, community attestation affidavits, or hostel rent receipts for verification.'}
        </p>
        <button
          type="button"
          onClick={() => alert('Document upload modal opened. Supported formats: PDF, JPG up to 5MB.')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          {language === 'hi' ? 'दस्तावेज़ चुनें (Upload File)' : 'Select Document File'}
        </button>
      </div>
    </div>
  );
};
