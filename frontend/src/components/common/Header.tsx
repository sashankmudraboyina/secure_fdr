import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import { 
  Bell, 
  HelpCircle, 
  ChevronDown,
  Menu,
  X,
  Shield,
  Check
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 select-none w-full">
      <div className="w-full flex items-stretch h-16">
        
        {/* Left: Brand Identity (Locked to md:w-64 to match the sidebar vertical grid line) */}
        <div className="w-auto md:w-64 px-4 sm:px-5 flex items-center justify-between shrink-0 md:border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-md md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Official Institutional Emblem Logo Mark */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-xs border border-slate-700">
                <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                  <path d="M12 8v8" stroke="white" strokeWidth="2" />
                  <path d="M8 12h8" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
                <Check className="w-2 h-2 text-white stroke-[3]" />
              </div>
            </div>

            {/* Brand Title */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap leading-tight">
                  SecureFDR
                </span>
                <span className="text-xs font-semibold text-amber-600 font-mono">
                  360
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight whitespace-nowrap leading-none mt-0.5">
                AICTE Regulatory Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Controls & Subtitle */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between min-w-0">
          
          {/* Service context / Subtitle */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <span className="font-semibold text-slate-700">Financial Instrument Assurance</span>
            <span className="text-slate-300">•</span>
            <span className="truncate">All India Council for Technical Education (Regulation Bureau)</span>
          </div>

          {/* Action Links & User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            
            {/* Help & Glossary Link */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
              title="View statutory and banking terms glossary"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="hidden sm:inline">Glossary & Terms</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </button>

            {/* Account & Role Switcher */}
            <div className="relative border-l border-slate-200 pl-2 sm:pl-3" ref={dropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 text-left py-1 px-2 rounded-md hover:bg-slate-100 transition group"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-900 max-w-[140px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    {getRoleShortLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 sm:hidden" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch User Role
                    </p>
                    <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
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
                            <span className="block font-medium">{user.name}</span>
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
