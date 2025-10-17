// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataverseApp } from "./product/DataverseApp";
import { UserListProvider } from "./context/UserListContext";

const queryClient = new QueryClient();

/**
 * アプリ全体のルートコンポーネント
 * - React Query Provider を適用
 * - UserListProvider を適用（登録済ユーザーの共有）
 * - DataverseApp（業務UI）を描画
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserListProvider>
        <DataverseApp />
      </UserListProvider>
    </QueryClientProvider>
  );
}
