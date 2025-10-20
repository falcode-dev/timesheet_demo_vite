// src/App.tsx
import { DataverseApp } from "./product/DataverseApp";
import { UserListProvider } from "./context/UserListContext";
import { FavoriteTaskProvider } from "./context/FavoriteTaskContext";

/**
 * アプリ全体のルートコンポーネント
 * - UserListProvider（ユーザー共有）
 * - FavoriteTaskProvider（お気に入りタスク共有）
 * - DataverseApp（業務UI）を描画
 */
export default function App() {
  return (
    <UserListProvider>
      <FavoriteTaskProvider>
        <DataverseApp />
      </FavoriteTaskProvider>
    </UserListProvider>
  );
}
