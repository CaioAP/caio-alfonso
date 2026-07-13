// Site-wide UI controller exposed by BaseLayout's pre-paint inline script.
// Lets client scripts (ThemeToggle, AccentPicker) drive theme + accent through
// one place, so a theme flip re-derives the active accent.
interface UiController {
  setTheme(theme: 'light' | 'dark'): void;
  setAccent(id: string): void;
  getAccentId(): string;
  currentTheme(): 'light' | 'dark';
}

interface Window {
  __ui: UiController;
}

interface DocumentEventMap {
  themechange: CustomEvent<{ theme: 'light' | 'dark' }>;
  accentchange: CustomEvent<{ accent: string }>;
}
