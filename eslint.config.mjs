// eslint.config.mjs — with inline rule explanations (EN)
import { fixupConfigRules } from "@eslint/compat";
// Adapts legacy configs/plugins to Flat Config.
import { FlatCompat } from "@eslint/eslintrc";
// Lets us reuse "extends" presets in Flat Config.
import pluginJs from "@eslint/js";
// Official ESLint JS recommended rules.
import importPlugin from "eslint-plugin-import";
// Import hygiene/consistency rules.
import preferArrow from "eslint-plugin-prefer-arrow";
// Prefer arrow functions & callbacks.
import hooksPlugin from "eslint-plugin-react-hooks";
// Enforce React Hooks rules.
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
// React recommended config (Flat).
// Plugin doesn't support TailwindV4
// FYI : https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325
// import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
// Predefined global vars (browser, node, etc.).
import tseslint from "typescript-eslint";

// TS parser + plugin + presets (Flat).

const compat = new FlatCompat();

export default [
  // Target all relevant source files
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },

  // Enable JSX syntax parsing
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

  // Browser globals (window, document, etc.)
  { languageOptions: { globals: globals.browser } },

  // ESLint JS recommended rules
  pluginJs.configs.recommended,

  // TS parser with project for type-aware rules
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2021,
        project: "tsconfig.json",
        sourceType: "module",
      },
    },
  },

  // TypeScript strict + stylistic presets
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Tailwind (disabled for v4)
  // ...tailwind.configs["flat/recommended"],

  // React recommended (fixed up for Flat)
  ...fixupConfigRules(pluginReactConfig),

  {
    plugins: {
      "prefer-arrow": preferArrow,
      "react-hooks": hooksPlugin,
      import: importPlugin,
    },
    // React Hooks best practices: rules-of-hooks + exhaustive-deps
    rules: hooksPlugin.configs.recommended.rules,
    settings: {
      react: { version: "detect" }, // Auto-detect React version
    },
  },

  // Next.js
  { ignores: [".next/"] }, // Ignore build output
  ...fixupConfigRules(compat.extends("plugin:@next/next/core-web-vitals")), // Perf/A11y best practices

  // ---- Custom rules (each explained) ----
  {
    rules: {
      // Prefer arrow functions (cleaner `this`, concise style)
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true, // Avoid `function` on prototypes
          singleReturnOnly: false, // Not limited to single-return functions
          classPropertiesAllowed: false, // Avoid class property arrow fns
        },
      ],

      // Prefer arrow callbacks (lexical `this`, concise)
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],

      // TS: Prefer function type aliases over callable interfaces
      "@typescript-eslint/prefer-function-type": "error",

      // React 17+/Next: no need to import React for JSX
      "react/react-in-jsx-scope": 0,

      // Use TS types instead of PropTypes
      "react/prop-types": 0,

      // Loosen TS “ban-types”
      "@typescript-eslint/ban-types": 0,

      // Tailwind plugin rule disabled (plugin not used)
      "tailwindcss/no-custom-classname": 0,

      // No unused vars; allow common ignore patterns
      "@typescript-eslint/no-unused-vars": [
        1,
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_|^err|^error", // e.g. _unused, err
          argsIgnorePattern: "^_|props|^_error", // e.g. _arg, props
        },
      ],

      // Enforce LF line endings
      "linebreak-style": ["error", "unix"],

      // Always require semicolons
      semi: ["error", "always"],

      // Forbid extra semicolons
      "no-extra-semi": "error",

      // Allow switch without default
      "default-case": 0,

      // Allow non-camelCase (interop, APIs)
      camelcase: 0,

      // Forbid anonymous default exports (better stack traces, DX)
      "import/no-anonymous-default-export": [
        "error",
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowLiteral: false,
          allowObject: false,
        },
      ],

      // Forbid all relative imports (../ and ./), except for assets
      "import/no-relative-packages": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*.{ts,tsx,js,jsx}", "./*.{ts,tsx,js,jsx}"],
              message:
                "Relative imports are not allowed for code files. Use path aliases (@components, @lib, @app, etc.) instead.",
            },
          ],
        },
      ],

      // Disallow async Promise executors (`new Promise(async ...)`)
      "no-async-promise-executor": "error",

      // Discourage await inside loops (prefer batching/Promise.all)
      "no-await-in-loop": "error",

      // Forbid console.log (use logger instead)
      "no-console": "error",

      // Warn on TODO/FIXME comments
      "no-warning-comments": [
        "off",
        {
          terms: ["TODO", "FIXME", "FIX", "REFACTOR"],
          location: "anywhere",
        },
      ],

      // Prevent confusing unicode regex classes
      "no-misleading-character-class": "error",

      // Forbid chained assignments (readability)
      "no-multi-assign": "error",

      // Forbid multiline strings with backslash escapes
      "no-multi-str": "error",

      // Allow nested ternaries (often OK in JSX)
      "no-nested-ternary": 0,

      // Forbid `new` with side effects only
      "no-new": "error",

      // Forbid `new Object()`; use `{}` instead
      "no-new-object": "error",

      // Forbid `new Symbol()` (Symbol is a function)
      "no-new-symbol": "error",

      // Forbid wrapper constructors (new String/Number/Boolean)
      "no-new-wrappers": "error",

      // Forbid calling non-callable builtins (e.g., Math())
      "no-obj-calls": "error",

      // Forbid string path concat in Node (`__dirname + "/x"`)
      "no-path-concat": "error",

      // Forbid `return await` (except in try/catch)
      "no-return-await": "error",

      // Forbid `javascript:` URLs
      "no-script-url": "error",

      // Forbid comparing a value to itself
      "no-self-compare": "error",

      // Forbid comma operator in expressions
      "no-sequences": "error",

      // Don’t shadow restricted names (undefined, NaN, etc.)
      "no-shadow-restricted-names": "error",

      // Forbid sparse arrays like `[,,]`
      "no-sparse-arrays": "error",

      // Forbid tab characters; use spaces
      "no-tabs": "error",

      // Flag `${}` inside normal strings
      "no-template-curly-in-string": "error",

      // Must call `super()` before using `this` in subclass ctors
      "no-this-before-super": "error",

      // Prefer numeric literal syntax (0b, 0o, 0x)
      "prefer-numeric-literals": "error",

      // Prefer object spread over `Object.assign`
      "prefer-object-spread": "error",

      // Prefer rest args `(...args)` over `arguments`
      "prefer-rest-params": "error",

      // Prefer spread `fn(...arr)` over `apply`
      "prefer-spread": "error",

      // Prefer template strings over concatenation
      "prefer-template": "error",

      // Require description in `Symbol('desc')`
      "symbol-description": "error",

      // Forbid loops that can’t iterate (logic error)
      "no-unreachable-loop": "error",

      // ---- TypeScript-focused correctness & style ----

      // Enforce consistent class member ordering
      "@typescript-eslint/member-ordering": "error",

      // Prefer method signatures over property function types in interfaces
      "@typescript-eslint/method-signature-style": "error",

      // Ban confusing `!` non-null assertions (e.g., `x!.y!`)
      "@typescript-eslint/no-confusing-non-null-assertion": "error",

      // Forbid `delete obj[someComputed]`
      "@typescript-eslint/no-dynamic-delete": "error",

      // Forbid CommonJS `require`; use ESM imports
      "@typescript-eslint/no-require-imports": "error",

      // Flag conditions that are always truthy/falsy (type-aware)
      "@typescript-eslint/no-unnecessary-condition": "error",

      // Avoid redundant namespace qualifiers
      "@typescript-eslint/no-unnecessary-qualifier": "error",

      // Don’t pass generics TS can infer
      "@typescript-eslint/no-unnecessary-type-arguments": "error",

      // Remove pointless constraints like `T extends unknown`
      "@typescript-eslint/no-unnecessary-type-constraint": "error",

      // Prefer `.includes()` over `indexOf(...) !== -1`
      "@typescript-eslint/prefer-includes": "error",

      // Prefer `??` for null/undefined fallbacks
      "@typescript-eslint/prefer-nullish-coalescing": "error",

      // Prefer optional chaining `a?.b?.c`
      "@typescript-eslint/prefer-optional-chain": "error",

      // Prefer `readonly` where possible
      "@typescript-eslint/prefer-readonly": "error",

      // Prefer `startsWith/endsWith` over regex/slice
      "@typescript-eslint/prefer-string-starts-ends-with": "error",

      // Prefer `// @ts-expect-error` over `// @ts-ignore`
      "@typescript-eslint/prefer-ts-expect-error": "error",

      // Functions returning Promise must be `async`
      "@typescript-eslint/promise-function-async": "error",

      // Require a compare fn in `array.sort()` when needed
      "@typescript-eslint/require-array-sort-compare": "error",

      // Merge compatible overloads
      "@typescript-eslint/unified-signatures": "error",

      // Allow empty object types when intentional
      "@typescript-eslint/no-empty-object-type": 0,

      // Enforce consistent array type style (defaults to `T[]`)
      "@typescript-eslint/array-type": "error",

      // Use `export type { … }` for type-only exports
      "@typescript-eslint/consistent-type-exports": "error",

      // Prefer dot notation when safe (`obj.prop`)
      "@typescript-eslint/dot-notation": "error",

      // Prefer `type` over `interface` for object shapes
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],

      // Don’t ignore Promises; `await` or handle them
      "@typescript-eslint/no-floating-promises": "error",

      // Use `import type { … }` for type-only imports
      "@typescript-eslint/consistent-type-imports": "error",

      // Defaulted parameters must be last
      "@typescript-eslint/default-param-last": "error",

      // Relaxed React/Next specifics
      "react/no-unescaped-entities": 0, // Allow raw quotes/gt in JSX text
      "react/no-unknown-property": 0, // Allow non-standard JSX props when needed
      "@next/next/no-img-element": 0, // Allow native <img>
    },
  },

  // ---- Next.js files: Allow export default function ----
  {
    files: [
      "app/**/page.{ts,tsx}",
      "app/**/layout.{ts,tsx}",
      "app/**/loading.{ts,tsx}",
      "app/**/error.{ts,tsx}",
      "app/**/not-found.{ts,tsx}",
      "app/**/default.{ts,tsx}",
      "app/**/template.{ts,tsx}",
      "app/**/route.{ts,tsx}",
      "app/**/sitemap.{ts,tsx}",
      "app/**/manifest.{ts,tsx}",
      "app/**/unauthorized.{ts,tsx}",
      "middleware.{ts,tsx}",
      "src/middleware.{ts,tsx}",
    ],
    rules: {
      "prefer-arrow/prefer-arrow-functions": "off",
    },
  },

  // ---- Global ignores ----
  {
    ignores: [
      "*/**.js",
      "*.js",
      "*.mjs",
      "zod",
      "*/**.mjs",
      "vitest.config.ts",
      "next-env.d.ts",
      ".next",
      ".react-email",
      ".vercel",
      ".vscode",
      "tailwind.config.js",
      "next.config.js",
      "eslint.config.mjs",
      "**/worker.js",
      "src/generated",
      ".claude",
      ".conductor",
    ],
  },
];
