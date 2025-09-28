# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## QR Code Schema (Unified)

The dashboard Registration tab now acts as a backup generator and produces the EXACT same JSON structure as the main generator at `Student-QR-Generator`.

```jsonc
{
  "institution": "Naga College Foundation",
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "course_year_section": "BSCS 3A",
  "student_id": "24-12345",
  "email": "sample@gbox.ncf.edu.ph",
  "generated_at": "2025-09-28T09:15:23.123Z", // ISO timestamp
  "academic_year": "2024-2025"
}
```

### QR Scanner Modal

A reusable QR code scanner modal component is available at `src/components/modals/QRScannerPage.tsx` leveraging `html5-qrcode`.

Basic example:

```tsx
import React, { useState } from 'react';
import QRScannerPage from './components/modals/QRScannerPage';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Open Scanner</button>
      <QRScannerPage
        isOpen={open}
        onClose={() => setOpen(false)}
        contextTitle="Event Check-In"
        onScan={(value) => {
          console.log('Scanned:', value);
          // handle value (e.g., POST to backend)
        }}
        onError={(err) => console.warn('Scanner error', err)}
        autoCloseOnScan
      />
    </div>
  );
}
```

Props:

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Close handler (also called when autoClose triggers) |
| `onScan` | `(text: string) => void` | Fired on successful decode |
| `onError?` | `(msg: string) => void` | Non-fatal decode / permission errors |
| `contextTitle?` | `string` | Subtitle above scanner (e.g., event name) |
| `constraints?` | `MediaTrackConstraints` | Custom camera constraints override |
| `autoCloseOnScan?` | `boolean` | Defaults true; closes after first scan |

Notes:
* If multiple cameras are available a Switch Camera button appears.
* The component automatically requests camera permission when opened.
* Errors like permission denial are surfaced with inline UI and `onError`.

Notes:
- `academic_year` hard‑coded for now (update when academic year rolls over).
- Scanner tolerates legacy/older fields (fname/lname/section_year) but always normalizes to the unified shape when displaying.
- `student_id` is the primary key used after scanning.

If you update the schema in the main generator, replicate the same change in `RegistrationForm` to keep parity.

---

## Planned Rewrite Notice

The **Scan QR** implementation and the **Registration** tab will undergo a **full rewrite / refactor** to:

1. Centralize validation + schema typing (shared TS type + Zod validation).
2. Add optimistic check‑in workflow with backend attendance API integration + retry queue when offline.
3. Provide clearer UX (scan history, duplicate detection, success/fail toasts, audio cues).
4. Improve accessibility (focus traps, keyboard nav, ARIA labels) and mobile ergonomics.
5. Unify form + QR schema generation logic (single source of truth: `/src/schema/qrStudent.ts`).

This note documents intent so downstream consumers are aware of potential breaking changes. Keep feature work isolated until rewrite lands.

