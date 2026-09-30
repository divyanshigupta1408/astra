import React, { useState } from 'react';
import { AuthUser, AppLanguage, CscBooking } from '../../types';
import { Building2, Calendar, Clock, MapPin, CheckCircle2, Download, Printer, X, PhoneCall, ShieldCheck, UserCheck } from 'lucide-react';

interface CscBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  language: AppLanguage;
  onBookingConfirmed?: (booking: CscBooking) => void;
}

export const CscBookingModal: React.FC<CscBookingModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onBookingConfirmed
}) => {
  const [district, setDistrict] = useState(user.assignedDistrict || 'Dantewada');
  const [block, setBlock] = useState('Karanjia Block');
  const [centreName, setCentreName] = useState('CSC Digital Seva Kendra #8410 (Near Block Office)');
  const [date, setDate] = useState('2026-10-14');
  const [slot, setSlot] = useState('Morning (10:00 AM - 12:00 PM)');
  const [serviceType, setServiceType] = useState('Document Scanning & DigiLocker PKI Ingest');
  const [confirmedBooking, setConfirmedBooking] = useState<CscBooking | null>(null);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: CscBooking = {
      id: `CSC-${Date.now().toString().slice(-6)}`,
      district,
      block,
      centreName,
      date,
      slot,
      serviceType,
      studentName: user.name,
      studentPhone: user.identifier || '9876543210',
      confirmedAt: new Date().toLocaleString()
    };
    setConfirmedBooking(newBooking);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedBooking ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'hi' ? 'सीएससी / आईटीडीए सहायता केंद्र' : 'Common Service Centre / ITDA Help'}</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'hi' ? 'निकटतम केंद्र पर सहायता स्लॉट बुक करें' : 'Book Help at a Nearby CSC / ITDA Office'}
              </h3>
              <p className="text-stone-500 text-[11px]">
                {language === 'hi'
                  ? 'मुफ्त बायोमेट्रिक ई-केवाईसी, दस्तावेज स्कैनिंग और बैंक आधार लिंकिंग हेतु आधिकारिक सहायता प्राप्त करें।'
                  : 'Get dedicated physical assistance for document digitization, Aadhaar bank seeding, or community attestation.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'जिला (District)' : 'District'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="Dantewada">Dantewada (Chhattisgarh)</option>
                    <option value="Bastar">Bastar (Chhattisgarh)</option>
                    <option value="Mayurbhanj">Mayurbhanj (Odisha)</option>
                    <option value="Koraput">Koraput (Odisha)</option>
                    <option value="Khunti">Khunti (Jharkhand)</option>
                    <option value="Dindori">Dindori (Madhya Pradesh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'ब्लॉक (Block / Tahsil)' : 'Block / Tahsil'}
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'सहायता केंद्र चुनें' : 'Designated Help Centre'}
                </label>
                <select
                  value={centreName}
                  onChange={(e) => setCentreName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="CSC Digital Seva Kendra #8410 (Near Block Office)">
                    CSC Digital Seva Kendra #8410 (Near Block Office)
                  </option>
                  <option value="ITDA Project Administrator Facilitation Desk">
                    ITDA Project Administrator Facilitation Desk (Tribal Welfare)
                  </option>
                  <option value="Gram Panchayat Seva Kendra (Ward 3)">
                    Gram Panchayat Seva Kendra (Ward 3)
                  </option>
                  <option value="Mobile Van Saturation Unit #2 (Weekly Camp)">
                    Mobile Van Saturation Unit #2 (Weekly Camp)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'आवश्यक सेवा (Service Required)' : 'Service Required'}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="Document Scanning & DigiLocker PKI Ingest">
                    High-Res Document Scanning &amp; DigiLocker Ingest
                  </option>
                  <option value="Bank NPCI Aadhaar Seeding Verification">
                    Bank NPCI DBT Aadhaar-Seeding Assistance
                  </option>
                  <option value="PESA Section 4(d) Community Attestation">
                    PESA Community Attestation Guidance &amp; Tahsil Inquiry
                  </option>
                  <option value="Complete Application Submission Support">
                    End-to-End Application Assistance with VLE operator
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'तारीख (Preferred Date)' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'समय स्लॉट (Time Slot)' : 'Time Slot'}
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="Morning (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 06:00 PM)">Evening (04:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>{language === 'hi' ? 'स्लॉट पुष्टि करें' : 'Confirm Free Appointment'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="space-y-4 text-center py-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Appointment Confirmed
              </span>
              <h3 className="text-base font-extrabold text-stone-900 mt-1">
                {language === 'hi' ? 'सहायता स्लॉट सफलतापूर्वक बुक किया गया!' : 'Help Slot Booked Successfully!'}
              </h3>
              <p className="text-stone-500 text-xs mt-0.5">
                {language === 'hi' ? 'कृपया केंद्र पर जाते समय मूल दस्तावेज साथ लाएं।' : 'Show this digital appointment slip at the help desk.'}
              </p>
            </div>

            {/* Slip Details Card */}
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500 text-[11px]">Booking Token:</span>
                <span className="font-mono font-extrabold text-stone-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {confirmedBooking.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Candidate Name:</span>
                  <span className="font-bold text-stone-800">{confirmedBooking.studentName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Registered Mobile:</span>
                  <span className="font-mono font-bold text-stone-800">{confirmedBooking.studentPhone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Date &amp; Time:</span>
                  <span className="font-bold text-emerald-800">{confirmedBooking.date} • {confirmedBooking.slot.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Service:</span>
                  <span className="font-semibold text-stone-800 truncate block">{confirmedBooking.serviceType}</span>
                </div>
              </div>
              <div className="border-t border-stone-200 pt-2 text-[11px]">
                <span className="text-stone-500 block">Center Address:</span>
                <span className="font-medium text-stone-900">{confirmedBooking.centreName}, {confirmedBooking.district}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 font-bold text-stone-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पर्ची प्रिंट करें' : 'Print Slip'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 font-bold text-white shadow-xs"
              >
                {language === 'hi' ? 'संपन्न (Done)' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
