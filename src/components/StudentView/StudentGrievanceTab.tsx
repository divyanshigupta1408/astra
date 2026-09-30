import React, { useState } from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { askAiAssistant } from '../../services/aiAssistant';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  HelpCircle, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface StudentGrievanceTabProps {
  user: AuthUser;
  language: AppLanguage;
  onLogAction?: (action: string, targetId: string) => void;
}

interface TicketItem {
  id: string;
  category: string;
  subject: string;
  submittedDate: string;
  status: 'In Progress' | 'Resolved' | 'Under Inquiry';
  response?: string;
}

export const StudentGrievanceTab: React.FC<StudentGrievanceTabProps> = ({
  user,
  language,
  onLogAction
}) => {
  // AI Assistant Chat inside Grievance
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं A.S.T.R.A मित्र हूँ। छात्रवृत्ति पात्रता, बैंक मैपर सीडिंग अथवा पोर्टल सहायता संबंधी कोई भी प्रश्न यहाँ पूछें।'
        : 'Namaste! I am A.S.T.R.A Mitra. You can ask about scheme eligibility, NPCI bank seeding, or report grievances here.'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Grievance Ticket Form
  const [showTicketForm, setShowTicketForm] = useState<boolean>(false);
  const [ticketCategory, setTicketCategory] = useState<string>('bank_seeding');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDescription, setTicketDescription] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  const [tickets, setTickets] = useState<TicketItem[]>([
    {
      id: 'GRV-2026-891',
      category: 'NPCI DBT Bank Seeding',
      subject: 'Aadhaar seed status showing inactive on bank terminal',
      submittedDate: '22 Sep 2026',
      status: 'Resolved',
      response: 'Nodal desk checked with CRGB Lead Bank Officer. Aadhaar mapper mandate refreshed and verified active on 24 Sep 2026.'
    },
    {
      id: 'GRV-2026-942',
      category: 'Income Certificate Update',
      subject: 'Submitted revised Tahsildar income certificate for FY 2026-27',
      submittedDate: '27 Sep 2026',
      status: 'In Progress',
      response: 'Application documents cross-indexed with DigiLocker. Final desk verification underway.'
    }
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const reply = await askAiAssistant(userText, language);
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      if (onLogAction) {
        onLogAction('STUDENT_AI_CHAT_CONSULTED', user.identifier);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: 'Thank you. Your query has been noted by the advisory desk.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    const newTicket: TicketItem = {
      id: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketCategory,
      subject: ticketSubject.trim(),
      submittedDate: '30 Sep 2026 (Today)',
      status: 'In Progress',
      response: 'Ticket logged with MoTA Public Grievance Officer. Statutory response SLA: 7 working days.'
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSubject('');
    setTicketDescription('');
    setShowTicketForm(false);
    setTicketSuccess(`Grievance registered with Ticket #${newTicket.id}. An SMS acknowledgment has been dispatched.`);
    setTimeout(() => setTicketSuccess(null), 6000);

    if (onLogAction) {
      onLogAction('STUDENT_GRIEVANCE_FILED', newTicket.id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {language === 'hi' ? 'सहायता केंद्र एवं शिकायत निवारण (Help & Grievance)' : 'Helpdesk & Grievance Redressal Portal'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'hi'
              ? 'एआई सहायक वनवृद्धि मित्र से बातचीत करें अथवा आधिकारिक शिकायत टिकट दर्ज करें।'
              : 'Interact with AI Mitra for instant guideline clarifications or file a formal statutory grievance.'}
          </p>
        </div>

        <button
          onClick={() => setShowTicketForm(!showTicketForm)}
          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showTicketForm ? 'Close Form' : (language === 'hi' ? 'नई शिकायत दर्ज करें' : 'File New Grievance')}</span>
        </button>
      </div>

      {ticketSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{ticketSuccess}</span>
        </div>
      )}

      {/* FORM: File New Ticket */}
      {showTicketForm && (
        <div className="bg-white border-2 border-amber-300 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Statutory Grievance Submission (CPGRAMS Integrated)
            </h4>
            <span className="text-[10px] font-mono text-stone-500">Citizen Charter SLA: 7 Days</span>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Grievance Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="bank_seeding">NPCI DBT Bank Seeding / IFSC Issue</option>
                  <option value="institute_delay">Institutional Verification Delay &gt; 30 Days</option>
                  <option value="document_friction">Caste / Income Certificate Digitization</option>
                  <option value="disbursal_token">PFMS Disbursal Advice Pending</option>
                  <option value="hostel_grant">Hostel &amp; Books Allowance Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subject / Brief Summary</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  placeholder="e.g. Bank mandate not reflecting on portal"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Detailed Grievance Description</label>
              <textarea
                rows={3}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                placeholder="Provide specific details such as date of bank visit, application number, or college desk name..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowTicketForm(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Submit Grievance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TWO COLUMNS: AI MITRA CHAT + REGISTERED TICKETS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Assistant Chat (Vanavriddhi Mitra) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 min-h-[420px]">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  A.S.T.R.A Mitra (AI Scholarship Guide)
                </h4>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                Bhashini Ready
              </span>
            </div>

            {/* Chat History */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-600 text-white font-medium'
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 rounded-xl px-3 py-2 text-xs text-stone-500 animate-pulse">
                    Mitra is consulting statutory scholarship guidelines...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-stone-100 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={language === 'hi' ? 'प्रश्न पूछें (उदा. आय प्रमाण पत्र वैधता)...' : 'Ask a question about your scholarship, DBT, or rules...'}
              className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isAiLoading || !chatInput.trim()}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right: Ticket Status List */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              {language === 'hi' ? 'आपकी शिकायतें (Grievances)' : 'Your Registered Tickets'}
            </h4>
            <span className="font-mono text-[10px] text-stone-500 font-bold">{tickets.length} Registered</span>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-stone-800 text-[11px]">{t.id}</span>
                    <div className="font-bold text-stone-900 mt-0.5">{t.subject}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="text-[10px] text-stone-500">
                  Category: <strong>{t.category}</strong> • Date: {t.submittedDate}
                </div>

                {t.response && (
                  <div className="bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-700 space-y-0.5">
                    <span className="font-bold text-stone-900 block text-[10px]">Officer Response:</span>
                    <p>{t.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
