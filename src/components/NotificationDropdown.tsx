import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Check, CheckCheck, Clock, ExternalLink, ShieldCheck, AlertCircle, FileText, CheckCircle2, Filter, Search } from 'lucide-react';
import { AuthUser } from '../types';

export type NotificationCategory = 'all' | 'status' | 'action' | 'alert';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: NotificationCategory;
  type: 'success' | 'alert' | 'info';
  actionLabel?: string;
}

interface NotificationDropdownProps {
  user: AuthUser;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');

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
          category: 'status',
          type: 'success',
          actionLabel: 'Check Status'
        },
        {
          id: 'notif-s2',
          title: 'Institutional Scrutiny Green Lane',
          message: 'Your Top Class ST application VV-2026-CG-088219 has passed OCR validation and is queued for officer sign-off.',
          timestamp: '2h ago',
          isRead: false,
          category: 'status',
          type: 'info'
        },
        {
          id: 'notif-s3',
          title: 'AY 2026-27 Renewal Open',
          message: 'Annual renewal window is open. Please submit semester-3 attendance certification before 30 October 2026.',
          timestamp: 'Yesterday',
          isRead: true,
          category: 'action',
          type: 'info'
        },
        {
          id: 'notif-s4',
          title: 'Mobile Saturation Camp in Dantewada',
          message: 'CSC & ITDA saturation van will be stationed at Block Office on 12-14 October for free eKYC assistance.',
          timestamp: '2d ago',
          isRead: true,
          category: 'alert',
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
          category: 'action',
          type: 'success',
          actionLabel: 'Review Batch'
        },
        {
          id: 'notif-o2',
          title: 'SLA Window Approaching',
          message: '2 applications in Amber Lane have reached 36 hours of the 48-hour institutional scrutiny window.',
          timestamp: '28m ago',
          isRead: false,
          category: 'alert',
          type: 'alert',
          actionLabel: 'View Queue'
        },
        {
          id: 'notif-o3',
          title: 'PFMS Disbursal Batch Cleared',
          message: 'Disbursal file #PFMS-2026-081 acknowledged by PFMS gateway. ₹18,40,000 released for 12 scholars.',
          timestamp: '3h ago',
          isRead: true,
          category: 'status',
          type: 'info'
        },
        {
          id: 'notif-o4',
          title: 'New Case Note from Campus ST Cell',
          message: 'Prof. Tirkey added verification note to file VV-2026-OD-091823 regarding physical admission proof.',
          timestamp: 'Yesterday',
          isRead: true,
          category: 'status',
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
        category: 'action',
        type: 'success',
        actionLabel: 'View Schedule'
      },
      {
        id: 'notif-m2',
        title: 'Alert Rule Breached: NPCI Seeding Gap',
        message: 'Aadhaar NPCI seeding failure rate is at 28.0%, exceeding your statutory alert threshold of 20.0%.',
        timestamp: '45m ago',
        isRead: false,
        category: 'alert',
        type: 'alert'
      },
      {
        id: 'notif-m3',
        title: 'Quarterly UC Audit Dispatched',
        message: 'Formal notices issued to 3 autonomous institutes regarding delayed Utilization Certificates.',
        timestamp: '2h ago',
        isRead: false,
        category: 'status',
        type: 'info'
      },
      {
        id: 'notif-m4',
        title: 'National DBT Telemetry Sync',
        message: '99.4% direct credit success rate achieved across 28 States & UTs. Zero PII exposure logged.',
        timestamp: 'Today, 08:30 IST',
        isRead: true,
        category: 'status',
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

  // Filtered notifications by category and read/unread
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (readFilter === 'unread' && n.isRead) return false;
      if (activeCategory !== 'all' && n.category !== activeCategory) return false;
      return true;
    });
  }, [notifications, activeCategory, readFilter]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 transition-colors text-stone-600 hover:text-stone-900 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-stone-400"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-extrabold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-xs">
          {/* Header */}
          <div className="p-3.5 bg-stone-50 border-b border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm">Notifications</span>
                {unreadCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[10px]">
                    All caught up
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Category Tabs & Read/Unread Filter */}
            <div className="flex items-center justify-between pt-1 gap-2">
              <div className="flex rounded-lg border border-stone-200 bg-white p-0.5 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeCategory === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('status')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeCategory === 'status' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
                >
                  Status
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('action')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeCategory === 'action' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
                >
                  Action
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('alert')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeCategory === 'alert' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
                >
                  Alerts
                </button>
              </div>

              {/* Unread Toggle */}
              <button
                type="button"
                onClick={() => setReadFilter(readFilter === 'all' ? 'unread' : 'all')}
                className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                  readFilter === 'unread'
                    ? 'bg-rose-50 text-rose-900 border-rose-300'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {readFilter === 'unread' ? 'Unread Only' : 'Show All'}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-stone-400 space-y-1">
                <Bell className="w-7 h-7 text-stone-300 mx-auto" />
                <p className="font-semibold text-stone-600">No notifications in this filter</p>
                <p className="text-[11px] text-stone-400">All updates within your role scope are cleared.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                    notif.isRead ? 'bg-white hover:bg-stone-50' : 'bg-emerald-50/50 hover:bg-emerald-50/80'
                  }`}
                >
                  {/* Category icon */}
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : notif.type === 'alert' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold leading-none ${notif.isRead ? 'text-stone-800' : 'text-stone-950 font-extrabold'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 bg-stone-100 px-1 rounded">
                        {notif.category}
                      </span>

                      {!notif.isRead && (
                        <span className="text-[10px] text-emerald-800 font-bold hover:underline">
                          Mark read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-stone-50 border-t border-stone-200 text-center text-[10px] text-stone-500">
            Real-time Direct Benefit Transfer &amp; Verification Alerts
          </div>
        </div>
      )}
    </div>
  );
};
