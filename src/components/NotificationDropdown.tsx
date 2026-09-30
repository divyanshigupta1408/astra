import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock, ExternalLink, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { AuthUser } from '../types';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'success' | 'alert' | 'info';
  actionLabel?: string;
}

interface NotificationDropdownProps {
  user: AuthUser;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate realistic notifications based on user role
  const getInitialNotifications = (): NotificationItem[] => {
    if (user.role === 'student') {
      return [
        {
          id: 'notif-s1',
          title: 'NPCI DBT Seeding Active',
          message: 'Direct Benefit Transfer link confirmed with State Bank of India account ending in 8821.',
          timestamp: '12m ago',
          isRead: false,
          type: 'success',
          actionLabel: 'Check Status'
        },
        {
          id: 'notif-s2',
          title: 'Institutional Scrutiny Green Lane',
          message: 'Your Top Class ST application VV-2026-CG-088219 has passed OCR validation and is queued for officer sign-off.',
          timestamp: '2h ago',
          isRead: false,
          type: 'info'
        },
        {
          id: 'notif-s3',
          title: 'AY 2026-27 Renewal Open',
          message: 'Annual renewal window is open. Please submit semester-3 attendance certification before 30 October 2026.',
          timestamp: 'Yesterday',
          isRead: true,
          type: 'info'
        }
      ];
    }

    if (user.role === 'officer') {
      const isInstitute = user.officerSubRole === 'institute';
      return [
        {
          id: 'notif-o1',
          title: 'Green Lane Batch Ready',
          message: isInstitute
            ? '6 high-confidence applications from your institute have passed cross-document reconciliation and await final sign-off.'
            : '14 district verification files cleared by Institute Nodal Officers in Odisha state.',
          timestamp: '4m ago',
          isRead: false,
          type: 'success',
          actionLabel: 'Review Batch'
        },
        {
          id: 'notif-o2',
          title: 'SLA Window Approaching',
          message: '2 applications in Amber Lane have reached 36 hours of the 48-hour institutional scrutiny window.',
          timestamp: '28m ago',
          isRead: false,
          type: 'alert',
          actionLabel: 'View Queue'
        },
        {
          id: 'notif-o3',
          title: 'PFMS Disbursal Batch Cleared',
          message: 'Disbursal file #PFMS-2026-081 acknowledged by PFMS gateway. ₹18,40,000 released for 12 scholars.',
          timestamp: '3h ago',
          isRead: true,
          type: 'info'
        }
      ];
    }

    // Ministry Analyst
    return [
      {
        id: 'notif-m1',
        title: 'Mobile Saturation Camp Approved',
        message: 'Special VLE enrollment & DBT bank-seeding drive for Dantewada, Chhattisgarh sanctioned for 12–14 Oct.',
        timestamp: '18m ago',
        isRead: false,
        type: 'success',
        actionLabel: 'View Schedule'
      },
      {
        id: 'notif-m2',
        title: 'Quarterly UC Audit Dispatched',
        message: 'Formal notices issued to 3 autonomous institutes regarding delayed Utilization Certificates.',
        timestamp: '2h ago',
        isRead: false,
        type: 'alert'
      },
      {
        id: 'notif-m3',
        title: 'National DBT Telemetry Sync',
        message: '99.4% direct credit success rate achieved across 28 States & UTs. Zero PII exposure logged.',
        timestamp: 'Today, 08:30 IST',
        isRead: true,
        type: 'info'
      }
    ];
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>(getInitialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400"
        aria-label={`Notifications: ${unreadCount} unread`}
        title="Portal Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-stone-950 font-mono ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 bg-stone-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-900">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-84 overflow-y-auto divide-y divide-stone-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No recent notifications
              </div>
            ) : (
              notifications.map((notif) => {
                let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
                if (notif.type === 'alert') {
                  icon = <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
                } else if (notif.type === 'info') {
                  icon = <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />;
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer text-xs ${
                      notif.isRead ? 'bg-white hover:bg-stone-50/70' : 'bg-amber-50/40 hover:bg-amber-50/80 font-medium'
                    }`}
                  >
                    {icon}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs ${notif.isRead ? 'text-stone-800' : 'text-stone-950 font-bold'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-stone-200 bg-stone-50 px-4 py-2 text-center text-[10px] text-stone-500">
            Real-time Direct Benefit Transfer &amp; GFR 2017 Audit Telemetry
          </div>
        </div>
      )}
    </div>
  );
};
