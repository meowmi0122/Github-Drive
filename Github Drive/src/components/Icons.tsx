import type { SVGProps } from "react";

const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconUpload = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>
);
export const IconFolder = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
);
export const IconFile = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>
);
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M5 12l5 5L20 7"/></svg>
);
export const IconWarn = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
);
export const IconLogout = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
);
export const IconUser = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
);
export const IconSearch = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
);
export const IconCopy = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
);
export const IconExternal = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
);
export const IconTrash = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
);
export const IconEye = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
);
export const IconImage = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
);
export const IconVideo = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/></svg>
);
export const IconMusic = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);
export const IconCode = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
);
export const IconDownload = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 3v12M6 9l6 6 6-6"/><path d="M4 21h16"/></svg>
);
export const IconSpinner = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p} className={"animate-spin " + (p.className || "")}>
    <path d="M21 12a9 9 0 1 1-6.2-8.55" />
  </svg>
);
export const IconGithub = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.94 10.94 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);
