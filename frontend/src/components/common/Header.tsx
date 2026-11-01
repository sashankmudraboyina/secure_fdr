import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import { 
  Bell, 
  HelpCircle, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    setIsGlossaryOpen, 
    setIsNotificationDrawerOpen, 
    notifications,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleShortLabel = (role: UserRole) => {
    switch (role) {
      case 'INSTITUTION_USER':
        return 'College Signatory';
      case 'AICTE_REVIEWER':
        return 'AICTE Scrutiny Officer';
      case 'AICTE_APPROVER':
        return 'AICTE Competent Approver';
      case 'BANK_VERIFIER':
        return 'Bank Verifier';
      case 'AUDITOR':
        return 'Vigilance Auditor';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Menu Toggle + Official Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Button (Mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-md md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* AICTE Logo badge */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shrink-0">
              AICTE
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Security Deposit Service
                </span>
                <span className="hidden md:inline-block text-[11px] font-medium text-slate-500 border-l border-slate-300 pl-2">
                  Regulation Bureau
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 leading-none">
                All India Council for Technical Education
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Help & Glossary Link */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">Help & Glossary</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </button>

            {/* Account & Role Switcher */}
            <div className="relative border-l border-slate-200 pl-1.5 sm:pl-3" ref={dropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 text-left py-1 px-1.5 sm:px-2 rounded-md hover:bg-slate-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-semibold shrink-0">
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-900 max-w-[120px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {getRoleShortLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 lg:hidden" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active User / Role
                    </p>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      {currentUser.organization}
                    </p>
                  </div>

                  <div className="py-1">
                    {DEMO_USERS.map((user) => {
                      const isCurrent = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchRole(user.role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                            isCurrent
                              ? 'bg-slate-50 text-slate-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="block">{user.name}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {getRoleShortLabel(user.role)}
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
