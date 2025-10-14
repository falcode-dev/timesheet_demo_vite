// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataverseApp } from "./product/DataverseApp";

const queryClient = new QueryClient();

/**
 * アプリ全体のルートコンポーネント
 * - React Query Provider を適用
 * - DataverseApp（業務UI）を描画
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataverseApp />
    </QueryClientProvider>
  );
}
