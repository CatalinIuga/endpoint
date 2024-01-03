import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const red = "#f87171",
  orange = "#fb923c",
  green = "#34d399",
  teal = "#38b2ac",
  blue = "#60a5fa",
  indigo = "#818cf8",
  purple = "#a78bfa",
  pink = "#f472b6";

const ternary = "rgba(245, 245, 240, 0.2)",
  selection = "rgba(119, 219, 143, 0.3)",
  bg2 = "#231f1f",
  bg3 = "#282525",
  bg4 = "#333131",
  primary = "#f5f5f0",
  selected = "rgba(245, 245, 240, 0.08)",
  invalid = red,
  background = bg2,
  cursor = primary;

// theme for the normal editor, has some rounded corners on the active line
export const customTheme = EditorView.theme(
  {
    "&": {
      color: primary,
      backgroundColor: background,
      fontSize: "16px",
    },

    ".cm-content": {
      caretColor: cursor,
    },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },

    // no clue what these are
    ".cm-panels": { backgroundColor: bg2, color: primary },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    // no clue if i even have this option in my editor
    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f",
    },

    ".cm-activeLine": {
      backgroundColor: selected,
      borderRadius: "0 6px 6px 0",
    },
    ".cm-activeLine::selection, .cm-activeLine > span::selection, .cm-activeLine > span > span::selection":
      { backgroundColor: red },
    // huh?
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: selection,
      color: orange,
    },

    ".cm-gutters": {
      backgroundColor: "transparent",
      color: primary,
      border: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      paddingLeft: "15px",
    },
    ".cm-foldGutter .cm-gutterElement": {
      paddingLeft: "10px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: bg4,
      color: primary,
    },
    ".cm-lineNumbers .cm-activeLineGutter": {
      borderRadius: "6px 0 0 6px",
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: primary,
    },
    // eh?
    ".cm-tooltip": {
      fontSize: "12px",
      border: "none",
      backgroundColor: bg3,
      maxWidth: "300px",
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: bg3,
      borderBottomColor: bg3,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: bg4,
        color: primary,
      },
    },
  },
  { dark: true },
);
// theme for the readonly editor, no rounded corners on the active line
export const customThemeReadonly = EditorView.theme(
  {
    "&": {
      color: primary,
      backgroundColor: background,
      fontSize: "16px",
    },

    ".cm-content": {
      caretColor: cursor,
    },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },

    // no clue what these are
    ".cm-panels": { backgroundColor: bg2, color: primary },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-activeLine": {
      backgroundColor: selected,
      borderRadius: "0 6px  6px 0",
    },
    ".cm-activeLine::selection, .cm-activeLine > span::selection, .cm-activeLine > span > span::selection":
      { backgroundColor: red },
    // huh?
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: selection,
      color: orange,
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: primary,
      border: "none",
    },
    ".cm-foldGutter .cm-gutterElement": {
      paddingLeft: "10px",
      borderRadius: "6px 0 0 6px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: bg4,
      color: primary,
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: primary,
    },
  },
  { dark: true },
);

// this styling is for both the normal and readonly editor
export const customThemeStyle = HighlightStyle.define([
  { tag: t.keyword, color: purple },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: pink,
  },
  { tag: [t.function(t.variableName), t.labelName], color: teal },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: orange },
  { tag: [t.definition(t.name), t.separator], color: indigo },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: red,
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: blue,
  },
  { tag: [t.meta, t.comment], color: ternary },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: purple, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: pink },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: orange },
  { tag: [t.processingInstruction, t.string, t.inserted], color: green },
  { tag: t.invalid, color: invalid },
]);

export const editorTheme: Extension = [
  customTheme,
  syntaxHighlighting(customThemeStyle),
];

export const readonlyTheme: Extension = [
  customThemeReadonly,
  syntaxHighlighting(customThemeStyle),
];
