# Hooks ディレクトリ構造

## 📁 ディレクトリ構成

```
hooks/
├── index.ts                    # 統合エクスポート
├── useAppController.ts         # アプリケーション統合制御
├── useAppState.ts              # アプリケーション状態管理
├── useTimeEntryActions.ts      # タイムエントリアクション
├── useModalActions.ts          # モーダルアクション
├── useCalendarController.ts    # カレンダー操作
├── useWorkOrders.ts            # WorkOrderデータ取得
├── useOptionSets.ts            # オプションセット取得
├── useEvents.ts                # イベントデータ取得
├── useResources.ts             # リソースデータ取得
├── useCurrentUser.ts           # 現在ユーザー取得
├── useSubcategories.ts         # サブカテゴリ取得
├── useTasks.ts                # タスク取得
└── README.md                   # このファイル
```

## 🎯 各フックの役割

### 統合制御
- **`useAppController`** - 全体の状態とロジックを統括
- **`useAppState`** - アプリケーション状態の管理

### ビジネスロジック
- **`useTimeEntryActions`** - タイムエントリのCRUD操作
- **`useModalActions`** - モーダルの開閉・保存処理
- **`useCalendarController`** - カレンダーの日付操作

### データ取得
- **`useWorkOrders`** - WorkOrder一覧取得
- **`useOptionSets`** - オプションセット取得
- **`useEvents`** - イベント一覧取得
- **`useResources`** - リソース一覧取得
- **`useCurrentUser`** - 現在ユーザー情報取得
- **`useSubcategories`** - サブカテゴリ取得
- **`useTasks`** - タスク取得

## 🔄 データフロー

```
useAppController
├── useAppState (状態管理)
├── useTimeEntryActions (ビジネスロジック)
├── useModalActions (モーダル制御)
├── useCalendarController (カレンダー制御)
└── データ取得フック群
    ├── useWorkOrders
    ├── useOptionSets
    ├── useEvents
    └── ...
```

## 📋 設計原則

### 1. **単一責任の原則**
- 各フックは明確な責任を持つ
- 機能別の分割

### 2. **再利用性**
- 独立して使用可能
- 組み合わせ可能な設計

### 3. **型安全性**
- TypeScriptによる型チェック
- 明確なインターフェース

### 4. **保守性**
- 機能別のファイル分割
- 明確な命名規則

## 🚀 使用方法

### 基本的な使用
```typescript
import { useAppController } from '../hooks';

const MyComponent = () => {
  const {
    workOrders,
    events,
    handleTimeEntrySubmit,
    // ... その他の機能
  } = useAppController();
  
  // コンポーネントの実装
};
```

### 個別フックの使用
```typescript
import { useWorkOrders, useEvents } from '../hooks';

const MyComponent = () => {
  const { workOrders } = useWorkOrders();
  const { events } = useEvents(selectedWO);
  
  // コンポーネントの実装
};
```

## 🔧 拡張方法

### 新しいフックの追加
1. 適切なファイル名でフックを作成
2. `index.ts`にエクスポートを追加
3. 必要に応じて`useAppController`に統合

### 既存フックの修正
1. 単一責任の原則を維持
2. 型安全性を確保
3. 既存のインターフェースを維持
