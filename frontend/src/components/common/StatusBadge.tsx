import React from 'react';
import { AdministrativeStatus, BankStatus, DiscrepancySeverity } from '../../types';

interface TagProps {
  status: AdministrativeStatus;
}

export const AdministrativeStatusBadge: React.FC<TagProps> = ({ status }) => {
  switch (status) {
    case 'ACCEPTED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          Accepted
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-sky-50 text-sky-800 border border-sky-200">
          Submitted
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
          Under review
        </span>
      );
    case 'NEEDS_CLARIFICATION':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-900 border border-amber-300">
          Action needed
        </span>
      );
    case 'RELEASE_IN_PROGRESS':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
          Release in progress
        </span>
      );
    case 'RELEASED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-teal-50 text-teal-800 border border-teal-200">
          Released
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-rose-50 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    case 'SUPERSEDED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
          Superseded
        </span>
      );
    default:
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
};

interface BankBadgeProps {
  status: BankStatus;
}

export const BankStatusBadge: React.FC<BankBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ACTIVE_LIEN_CONFIRMED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          Bank verified
        </span>
      );
    case 'ACTIVE_LIEN_MISMATCH':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-900 border border-amber-200">
          Lien mismatch
        </span>
      );
    case 'CLOSED_OR_ENCASHED':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-900 border border-rose-300">
          Account closed
        </span>
      );
    case 'NOT_FOUND':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-800 border border-slate-300">
          Not found
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">
          Awaiting bank
        </span>
      );
    case 'MATURITY_MISMATCH':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded bg-amber-50 text-amber-800 border border-amber-200">
          Maturity mismatch
        </span>
      );
    default:
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-normal text-slate-500">
          Unverified
        </span>
      );
  }
};

export const SeverityBadge: React.FC<{ severity: DiscrepancySeverity }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-900 border border-rose-300">
          Urgent
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-900 border border-amber-300">
          Requires review
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-yellow-50 text-yellow-800 border border-yellow-200">
          Check required
        </span>
      );
    default:
      return (
        <span className="inline-block px-2 py-0.5 text-xs font-normal text-slate-600">
          Minor
        </span>
      );
  }
};
