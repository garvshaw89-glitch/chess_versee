import React, { useState } from 'react';
import { Bell, Check, Trophy, Swords, Zap, MessageSquare, Trash2, X } from 'lucide-react';
import { soundService } from '../../services/sound';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'challenge' | 'achievement' | 'tournament' | 'system';
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptChallenge?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onAcceptChallenge,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Arena Challenge Received',
      message: 'Alex (Elo 1210) challenged you to a 5+3 Blitz match.',
      time: '5m ago',
      type: 'challenge',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Grandmaster Daily Puzzle',
      message: 'New Daily Puzzle: "Morphy Opera House Decoy" is ready to solve.',
      time: '1h ago',
      type: 'achievement',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Weekly Rapid Open Tournament',
      message: 'Registration is now open for the Sunday Grandmaster Swiss.',
      time: '3h ago',
      type: 'tournament',
      read: true,
    },
    {
      id: 'notif-4',
      title: 'Tactical Rating Milestone',
      message: 'Congratulations! Your tactical puzzle rating reached 1,420 Elo.',
      time: '1d ago',
      type: 'system',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    soundService.playClick();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    soundService.playClick();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0A0E13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#10151C]/60">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#E8C75A]" />
            <h2 className="text-sm font-bold text-[#F5F7FA]">Dispatch Center</h2>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#E8C75A]/40 text-[10px] font-mono font-bold text-[#E8C75A]">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-[#8D98A8] hover:text-[#F5F7FA] hover:bg-white/5 cursor-pointer text-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearAll}
              title="Clear all"
              className="p-1.5 rounded-lg text-[#8D98A8] hover:text-[#E45D6A] hover:bg-white/5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8D98A8] hover:text-[#F5F7FA] hover:bg-white/5 cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-[#667080] text-xs font-mono">
              All dispatches cleared. You are caught up.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.read
                    ? 'bg-[#0B1017]/40 border-white/5 text-[#8D98A8]'
                    : 'bg-[#10151C] border-[#C9A227]/30 text-[#F5F7FA] shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'challenge' && <Swords className="w-4 h-4 text-[#5ED6E6]" />}
                    {item.type === 'achievement' && <Zap className="w-4 h-4 text-[#E8C75A]" />}
                    {item.type === 'tournament' && <Trophy className="w-4 h-4 text-[#5B8CFF]" />}
                    {item.type === 'system' && <Bell className="w-4 h-4 text-[#8D98A8]" />}
                    <span className="text-xs font-bold text-[#F5F7FA]">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#667080]">{item.time}</span>
                </div>

                <p className="text-xs text-[#8D98A8] mt-1.5 leading-relaxed">{item.message}</p>

                {item.type === 'challenge' && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        soundService.playClick();
                        onClose();
                        if (onAcceptChallenge) onAcceptChallenge();
                      }}
                      className="px-3 py-1 rounded-lg bg-[#C9A227] hover:bg-[#E8C75A] text-[#05070A] text-xs font-bold font-mono transition-colors cursor-pointer"
                    >
                      Accept Match
                    </button>
                    <button
                      onClick={() => {
                        soundService.playClick();
                        setNotifications((prev) => prev.filter((n) => n.id !== item.id));
                      }}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#8D98A8] transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
