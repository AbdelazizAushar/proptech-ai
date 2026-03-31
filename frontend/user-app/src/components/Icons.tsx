/**
 * Icons.tsx — Shared inline SVG icon library
 * All icons are 24×24 viewBox, stroke-based, consistent style.
 * No external dependency required.
 */

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = (size: number, sw: number, children: React.ReactNode, cls?: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cls}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconBuilding = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
    <rect x="12" y="12" width="4" height="5" rx="0.5" />
    <line x1="12" y1="5" x2="12" y2="9" />
    <line x1="6" y1="5" x2="6" y2="9" />
    <line x1="18" y1="5" x2="18" y2="9" />
  </>, className);

export const IconMapPin = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M12 21c0 0-7-6.545-7-11a7 7 0 0 1 14 0c0 4.455-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </>, className);

export const IconBed = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M2 17V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M2 17h20" />
    <path d="M7 9v4" />
    <path d="M7 13h10" />
    <rect x="9" y="9" width="6" height="4" rx="1" />
    <line x1="2" y1="20" x2="2" y2="17" />
    <line x1="22" y1="20" x2="22" y2="17" />
  </>, className);

export const IconBath = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M3 12h18v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-3z" />
    <path d="M3 12V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
    <line x1="8" y1="18" x2="8" y2="21" />
    <line x1="16" y1="18" x2="16" y2="21" />
  </>, className);

export const IconSquare = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <polyline points="9,4 4,4 4,9" />
    <polyline points="15,4 20,4 20,9" />
    <polyline points="9,20 4,20 4,15" />
    <polyline points="15,20 20,20 20,15" />
  </>, className);

export const IconSearch = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </>, className);

export const IconHome = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M3 12L12 3l9 9" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
  </>, className);

export const IconStar = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </>, className);

export const IconCheckCircle = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </>, className);

export const IconWhatsApp = ({ size = 24, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.838L.07 23.29a.75.75 0 0 0 .922.922l5.474-1.457A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.964-1.362l-.356-.211-3.685.981.992-3.636-.232-.374A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
);

export const IconPhone = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.07 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
  </>, className);

export const IconMail = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </>, className);

export const IconUser = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>, className);

export const IconArrowLeft = ({ size = 24, strokeWidth = 2, className }: IconProps) =>
  base(size, strokeWidth, <>
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10,18 4,12 10,6" />
  </>, className);

export const IconX = ({ size = 24, strokeWidth = 2, className }: IconProps) =>
  base(size, strokeWidth, <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>, className);

export const IconFilter = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </>, className);

export const IconKey = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </>, className);

export const IconCalendar = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>, className);

export const IconFloor = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <line x1="3" y1="9"  x2="21" y2="9"  />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3"  x2="9"  y2="21" />
  </>, className);

export const IconTag = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </>, className);

export const IconElevator = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="12" y1="2"  x2="12" y2="22" />
    <polyline points="8,8 10,6 12,8" />
    <polyline points="12,16 14,18 16,16" />
  </>, className);

export const IconBookmark = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </>, className);

export const IconShare = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <circle cx="18" cy="5"  r="3" />
    <circle cx="6"  cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
  </>, className);

export const IconImages = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <rect x="3"  y="3"  width="14" height="14" rx="2" />
    <path d="M21 9h-4a2 2 0 0 0-2 2v9" />
    <path d="M21 15v6" />
    <path d="M3 15l4-4 3 3 3-3 4 4" />
    <circle cx="8" cy="9" r="1.5" />
  </>, className);

export const IconCheckBadge = ({ size = 24, strokeWidth = 1.75, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9,12 11,14 15,10" />
  </>, className);

export const IconXCircle = ({ size = 24, strokeWidth = 1.75, className }: IconProps) =>
  base(size, strokeWidth, <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </>, className);

export const IconLocation = ({ size = 24, strokeWidth = 1.5, className }: IconProps) =>
  base(size, strokeWidth, <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </>, className);
