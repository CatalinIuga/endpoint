import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state";
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { theme } from "./theme";

// This is a custom fold setup that uses a custom DOM element as the marker
const customFoldSetup = foldGutter({
  markerDOM: (open) => {
    const arrow = document.createElement("span");
    arrow.className = "cm-foldmarker";
    arrow.textContent = open ? "▼" : "▶";
    return arrow;
  },
});

// You can find the basic setup on github, I removed some of the extensions to fit my needs
const customBasicSetup: Extension = (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
])();

export const baseExtensions = [
  customBasicSetup,
  customFoldSetup,
  theme,
  EditorView.lineWrapping,
];

export const readonlyBasicSetup: Extension = (() => [
  highlightSpecialChars(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
])();

export const readonlyExtensions = [
  readonlyBasicSetup,
  theme,
  EditorView.lineWrapping,
];
