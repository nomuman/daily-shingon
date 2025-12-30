/**
 * Purpose: TypeScript module declarations for FormatJS plural rules polyfills. / 目的: FormatJS複数形ポリフィルの型宣言。
 * Responsibilities: allow TS to import polyfill modules without type errors. / 役割: TSがポリフィルを型エラーなくimportできるようにする。
 * Inputs: module specifiers. / 入力: モジュール指定子。
 * Outputs: ambient module declarations. / 出力: アンビエント宣言。
 * Dependencies: FormatJS polyfill packages. / 依存: FormatJSポリフィルパッケージ。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none (type-only declarations). / 例外: なし（型宣言のみ）。
 */
declare module '@formatjs/intl-pluralrules/polyfill-force.js';
declare module '@formatjs/intl-pluralrules/polyfill.js';
declare module '@formatjs/intl-pluralrules/locale-data/*.js';
