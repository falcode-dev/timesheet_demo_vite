// src/App.tsx
import { DataverseApp } from "./product/DataverseApp";
import { UserListProvider } from "./context/UserListContext";

/**
 * アプリ全体のルートコンポーネント
 * - UserListProvider を適用（登録済ユーザーの共有）
 * - DataverseApp（業務UI）を描画
 */
export default function App() {
  return (
    <UserListProvider>
      <DataverseApp />
    </UserListProvider>
  );
}
