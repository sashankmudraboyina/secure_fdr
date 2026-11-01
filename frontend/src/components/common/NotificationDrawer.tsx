import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRight } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    notifications, 
    markNotificationRead,
    setSelectedInstrumentId,
    setActiveTab
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <div className="w-full max-w-sm bg-white h-full shadow-xl border-l border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
          <button 
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4 space-y-3">
          {notifications.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 rounded border text-xs transition ${
                item.isRead 
                  ? 'bg-slate-50 border-slate-200 text-slate-600' 
                  : 'bg-white border-slate-300 shadow-2xs text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-slate-600 leading-normal mb-2">{item.message}</p>
              
              <div className="flex items-center justify-between pt-1">
                {item.resourceId && (
                  <button
                    onClick={() => {
                      if (item.resourceId?.startsWith('fdr-')) {
                        setSelectedInstrumentId(item.resourceId);
                        setActiveTab('passport');
                      } else if (item.resourceId?.startsWith('rel-')) {
                        setActiveTab('release-cases');
                      }
                      markNotificationRead(item.id);
                      setIsNotificationDrawerOpen(false);
                    }}
                    className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
                  >
                    <span>View record</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {!item.isRead && (
                  <button 
                    onClick={() => markNotificationRead(item.id)}
                    className="text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No notifications.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
