# RLS（Row Level Security）

## 目的
- “ユーザーは自分の行しか読めない/書けない” をDBで強制する

## 基本
- profiles / devices / user_settings / entries / bookmarks / progress はRLS有効化
- select/insert/update/delete 全てに policy を貼る

## 代表例（entries）
- SELECT: auth.uid() = user_id
- INSERT: with check auth.uid() = user_id
- UPDATE: using + with check auth.uid() = user_id
- DELETE: using auth.uid() = user_id
