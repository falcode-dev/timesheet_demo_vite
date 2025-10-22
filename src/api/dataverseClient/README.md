# Dataverse API クライアント

## 概要

このパッケージは、Dataverse API へのアクセスを提供する型安全で拡張可能なクライアントライブラリです。保守性、可読性、拡張性、汎用性を重視した設計になっています。

## 主な特徴

### 🏗️ アーキテクチャ
- **ベースクライアントクラス**: 共通処理の抽象化
- **型安全性**: TypeScript による完全な型チェック
- **エラーハンドリング**: 統一されたエラー処理とログ機能
- **設定管理**: 環境別設定の自動切り替え
- **モックデータ**: 開発・テスト環境用のサンプルデータ

### 🔧 機能
- **CRUD操作**: 作成、読み取り、更新、削除の完全サポート
- **クエリオプション**: フィルタリング、ソート、ページネーション
- **リトライ機能**: ネットワークエラー時の自動再試行
- **ログ機能**: 詳細な操作ログとデバッグ情報
- **レガシー互換性**: 既存コードとの完全な互換性

## 使用方法

### レガシーAPI（既存コードとの互換性）

```typescript
import { dataverseClient } from './api/dataverseClient';

// リソース一覧取得
const resources = await dataverseClient.getResources();

// タイムエントリ作成
const timeEntry = await dataverseClient.createTimeEntry({
    title: '開発作業',
    start: new Date(),
    end: new Date(Date.now() + 8 * 60 * 60 * 1000)
});
```

### 新しいクラスベースAPI（推奨）

```typescript
import { DataverseClients } from './api/dataverseClient';

// リソースクライアントの使用
const resourceClient = new DataverseClients.Resource();
const response = await resourceClient.getEntities();

if (response.success) {
    console.log('リソース一覧:', response.data);
} else {
    console.error('エラー:', response.error);
}

// タイムエントリクライアントの使用
const timeEntryClient = new DataverseClients.TimeEntry();
const createResponse = await timeEntryClient.createEntity({
    title: '開発作業',
    start: new Date(),
    end: new Date(Date.now() + 8 * 60 * 60 * 1000)
});
```

### 高度な使用方法

```typescript
import { DataverseClients, QueryOptions } from './api/dataverseClient';

// クエリオプションを使用した検索
const taskClient = new DataverseClients.Task();
const queryOptions: QueryOptions = {
    select: ['id', 'name'],
    filter: 'name contains "開発"',
    orderBy: 'name asc',
    top: 10
};

const response = await taskClient.getEntities(queryOptions);

// エラーハンドリング
if (!response.success) {
    console.error('操作失敗:', response.error);
    return;
}

console.log('タスク一覧:', response.data);
```

## 設定

### 環境別設定

```typescript
import { getConfig, ENVIRONMENT_CONFIGS } from './api/dataverseClient';

// 開発環境設定
const devConfig = ENVIRONMENT_CONFIGS.development;

// 本番環境設定
const prodConfig = ENVIRONMENT_CONFIGS.production;

// カスタム設定
const customConfig = {
    enableLogging: true,
    logLevel: 'DEBUG',
    enableMockData: false,
    timeout: 30000,
    retryAttempts: 3
};
```

### ログ設定

```typescript
import { Logger, LogLevel } from './api/dataverseClient';

const logger = Logger.getInstance();
logger.log({
    level: LogLevel.INFO,
    message: 'カスタムログメッセージ',
    timestamp: Date.now(),
    entityName: 'custom',
    operation: 'customOperation'
});
```

## 型定義

### 基本エンティティ

```typescript
interface BaseEntity {
    id: string;
    name: string;
}
```

### API レスポンス

```typescript
interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: string;
    timestamp: number;
}
```

### クエリオプション

```typescript
interface QueryOptions {
    select?: string[];
    filter?: string;
    orderBy?: string;
    top?: number;
    skip?: number;
    expand?: string[];
}
```

## エラーハンドリング

```typescript
import { DataverseError, ErrorType } from './api/dataverseClient';

try {
    const response = await client.getEntities();
    // 処理続行
} catch (error) {
    if (error instanceof DataverseError) {
        switch (error.type) {
            case ErrorType.NETWORK:
                console.error('ネットワークエラー:', error.message);
                break;
            case ErrorType.PERMISSION:
                console.error('権限エラー:', error.message);
                break;
            default:
                console.error('その他のエラー:', error.message);
        }
    }
}
```

## モックデータ

開発・テスト環境では、実際のDataverseに接続せずにモックデータを使用できます。

```typescript
import { MockDataHelper } from './api/dataverseClient';

// モックデータの取得
const mockResources = MockDataHelper.getMockData('resources');
const mockTasks = MockDataHelper.getMockData('tasks');

// ランダムIDの生成
const newId = MockDataHelper.generateId('resource');
```

## 拡張方法

### 新しいクライアントの作成

```typescript
import { BaseClient } from './api/dataverseClient';

class CustomClient extends BaseClient<CustomEntity, CustomInput> {
    constructor() {
        super('custom_entity', getConfig());
    }

    protected async getEntitiesInternal(queryOptions?: QueryOptions): Promise<CustomEntity[]> {
        // カスタム実装
    }

    // その他の抽象メソッドを実装
}
```

## ベストプラクティス

1. **型安全性**: 常に型定義を使用する
2. **エラーハンドリング**: 適切なエラーハンドリングを実装する
3. **ログ**: 重要な操作にはログを記録する
4. **設定**: 環境に応じた適切な設定を使用する
5. **テスト**: モックデータを使用したテストを実装する

## トラブルシューティング

### よくある問題

1. **Xrm環境が存在しない**
   - ローカル開発環境では自動的にモックデータが使用されます

2. **型エラーが発生する**
   - 適切な型定義をインポートしているか確認してください

3. **API呼び出しが失敗する**
   - エラーログを確認し、適切なエラーハンドリングを実装してください

### デバッグ

```typescript
import { Logger, LogLevel } from './api/dataverseClient';

// デバッグログの有効化
const logger = Logger.getInstance({
    enableLogging: true,
    logLevel: LogLevel.DEBUG
});
```
