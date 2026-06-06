"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";
import { useTheme } from "@/components/theme-provider";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-[var(--radius)] border border-border bg-muted/30 flex items-center justify-center">
      <p className="text-xs text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

type MonacoEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
};

const languageMap: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  js: "javascript",
  html: "html",
  css: "css",
  typescript: "typescript",
  ts: "typescript",
  java: "java",
  cpp: "cpp",
  c: "c",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  sql: "sql",
};

const EDUVERSE_DARK_THEME: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6c6b66", fontStyle: "italic" },
    { token: "keyword", foreground: "e88d6a" },
    { token: "string", foreground: "b5c96a" },
    { token: "number", foreground: "d4a05a" },
    { token: "type", foreground: "7c6cf0" },
    { token: "function", foreground: "6ab0e8" },
    { token: "variable", foreground: "d4d1c6" },
    { token: "constant", foreground: "e88d6a" },
    { token: "operator", foreground: "c3c0b6" },
    { token: "delimiter", foreground: "a8a69c" },
  ],
  colors: {
    "editor.background": "#1a1a18",
    "editor.foreground": "#d4d1c6",
    "editor.lineHighlightBackground": "#2a2a28",
    "editor.selectionBackground": "#3a3a34",
    "editor.inactiveSelectionBackground": "#2e2e2c",
    "editorCursor.foreground": "#e88d6a",
    "editorLineNumber.foreground": "#4a4942",
    "editorLineNumber.activeForeground": "#e88d6a",
    "editor.selectionHighlightBackground": "#e88d6a18",
    "editorBracketMatch.background": "#3a3a34",
    "editorBracketMatch.border": "#e88d6a40",
    "editorGutter.background": "#1a1a18",
    "editorWidget.background": "#242422",
    "editorWidget.border": "#3a3a34",
    "input.background": "#1e1e1c",
    "input.foreground": "#d4d1c6",
    "input.border": "#3a3a34",
    "list.hoverBackground": "#2e2e2c",
    "list.activeSelectionBackground": "#3a3a34",
    "editorError.foreground": "#f05a5a",
    "editorWarning.foreground": "#d4a05a",
    "editorInfo.foreground": "#6ab0e8",
    "minimap.background": "#1a1a18",
  },
};

const EDUVERSE_LIGHT_THEME: editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: "9a9890", fontStyle: "italic" },
    { token: "keyword", foreground: "c96442" },
    { token: "string", foreground: "6a8c30" },
    { token: "number", foreground: "b08030" },
    { token: "type", foreground: "7c6cf0" },
    { token: "function", foreground: "3070b0" },
    { token: "variable", foreground: "2d2a1e" },
    { token: "constant", foreground: "c96442" },
    { token: "operator", foreground: "4a4840" },
    { token: "delimiter", foreground: "7a7872" },
  ],
  colors: {
    "editor.background": "#faf9f5",
    "editor.foreground": "#2d2a1e",
    "editor.lineHighlightBackground": "#f0ede4",
    "editor.selectionBackground": "#e0dfd8",
    "editor.inactiveSelectionBackground": "#e8e4d8",
    "editorCursor.foreground": "#c96442",
    "editorLineNumber.foreground": "#c4c2b7",
    "editorLineNumber.activeForeground": "#c96442",
    "editor.selectionHighlightBackground": "#c9644218",
    "editorBracketMatch.background": "#e0dfd8",
    "editorBracketMatch.border": "#c9644240",
    "editorGutter.background": "#faf9f5",
    "editorWidget.background": "#f0ede4",
    "editorWidget.border": "#e0dfd8",
    "input.background": "#ffffff",
    "input.foreground": "#2d2a1e",
    "input.border": "#e0dfd8",
    "list.hoverBackground": "#e8e4d8",
    "list.activeSelectionBackground": "#e0dfd8",
    "editorError.foreground": "#d03a3a",
    "editorWarning.foreground": "#b08030",
    "editorInfo.foreground": "#3070b0",
  },
};

declare module "@monaco-editor/react" {
  export function defineTheme(themeName: string, themeData: editor.IStandaloneThemeData): void;
}

let themeDefined = false;

export function MonacoEditor({ value, onChange, language, height }: MonacoEditorProps) {
  const { theme: appTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleMount = useCallback((ed: editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) => {
    editorRef.current = ed;

    if (!themeDefined) {
      monaco.editor.defineTheme("eduverse-dark", EDUVERSE_DARK_THEME);
      monaco.editor.defineTheme("eduverse-light", EDUVERSE_LIGHT_THEME);
      themeDefined = true;
    }

    monaco.editor.setTheme(appTheme === "dark" ? "eduverse-dark" : "eduverse-light");

    setIsReady(true);
  }, [appTheme]);

  useEffect(() => {
    if (!isReady) return;
    const monaco = (window as unknown as Record<string, object>).monaco as { editor: { setTheme: (t: string) => void } };
    if (monaco) {
      monaco.editor.setTheme(appTheme === "dark" ? "eduverse-dark" : "eduverse-light");
    }
  }, [appTheme, isReady]);

  return (
    <Editor
      height={height ?? "300px"}
      language={language ? languageMap[language] ?? language : "python"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 15,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        formatOnPaste: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        hover: { enabled: true, delay: 300 },
        folding: true,
        foldingHighlight: true,
        links: true,
        bracketPairColorization: { enabled: true },
        padding: { top: 8 },
        renderWhitespace: "selection",
      }}
    />
  );
}
