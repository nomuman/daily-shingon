/**
 * Purpose: TypeScript module declaration for SVG imports. / 目的: SVGインポート用の型宣言。
 * Responsibilities: describe SVG module shape as a React component. / 役割: SVGをReactコンポーネントとして扱う型を定義。
 * Inputs: "*.svg" module specifiers. / 入力: "*.svg"モジュール指定子。
 * Outputs: FC<SvgProps> default export type. / 出力: FC<SvgProps>のデフォルトエクスポート型。
 * Dependencies: react, react-native-svg types. / 依存: react、react-native-svgの型。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none (type-only declarations). / 例外: なし（型宣言のみ）。
 */
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: FC<SvgProps>;
  export default content;
}
