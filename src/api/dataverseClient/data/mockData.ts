/**
 * モックデータ管理
 * - 開発・テスト環境用のサンプルデータを一元管理
 */

import type { BaseEntity } from '../core/types';

/** リソース（BookableResource）のモックデータ */
export const MOCK_RESOURCES = [
    { id: "1", name: "田中 太郎", number: "0001", lastName: "田中", firstName: "太郎", fullName: "田中 太郎" },
    { id: "2", name: "佐藤 花子", number: "0002", lastName: "佐藤", firstName: "花子", fullName: "佐藤 花子" },
    { id: "3", name: "鈴木 次郎", number: "0003", lastName: "鈴木", firstName: "次郎", fullName: "鈴木 次郎" },
    { id: "4", name: "高橋 美咲", number: "0004", lastName: "高橋", firstName: "美咲", fullName: "高橋 美咲" },
    { id: "5", name: "山田 健一", number: "0005", lastName: "山田", firstName: "健一", fullName: "山田 健一" }
];

/** サブカテゴリのモックデータ */
export const MOCK_SUBCATEGORIES = [
    { id: "sub-001", name: "教育・研修" },
    { id: "sub-002", name: "品質改善" },
    { id: "sub-003", name: "業務効率化" },
    { id: "sub-004", name: "システム開発" },
    { id: "sub-005", name: "顧客対応" },
    { id: "sub-006", name: "会議・打ち合わせ" }
];

/** タスクのモックデータ */
export const MOCK_TASKS = [
    { id: "task-001", name: "資料作成", subcategoryId: "sub-001" },
    { id: "task-002", name: "会議準備", subcategoryId: "sub-006" },
    { id: "task-003", name: "品質テスト", subcategoryId: "sub-002" },
    { id: "task-004", name: "コードレビュー", subcategoryId: "sub-004" },
    { id: "task-005", name: "顧客ヒアリング", subcategoryId: "sub-005" },
    { id: "task-006", name: "プロセス改善", subcategoryId: "sub-003" }
];

/** ワークオーダーのモックデータ */
export const MOCK_WORK_ORDERS = [
    { id: "wo-001", name: "システム改修プロジェクト" },
    { id: "wo-002", name: "新機能開発" },
    { id: "wo-003", name: "バグ修正対応" },
    { id: "wo-004", name: "パフォーマンス改善" },
    { id: "wo-005", name: "セキュリティ強化" }
];

/** ユーザー情報のモックデータ */
export const MOCK_CURRENT_USER = {
    id: "local-resource",
    name: "テスト 太郎",
    firstName: "太郎",
    lastName: "テスト",
    employeeId: "999999"
};

/** タイムゾーンのモックデータ */
export const MOCK_TIMEZONES = [
    { value: "1", label: "東京 (UTC+9)" },
    { value: "2", label: "ニューヨーク (UTC-5)" },
    { value: "3", label: "ロンドン (UTC+0)" },
    { value: "4", label: "シドニー (UTC+10)" },
    { value: "5", label: "ロサンゼルス (UTC-8)" }
];

/** オプションセットのモックデータ */
export const MOCK_OPTION_SETS = {
    mainCategory: [
        { value: "1", label: "開発" },
        { value: "2", label: "テスト" },
        { value: "3", label: "運用" },
        { value: "4", label: "管理" }
    ],
    timeCategory: [
        { value: "1", label: "通常勤務" },
        { value: "2", label: "残業" },
        { value: "3", label: "休日出勤" },
        { value: "4", label: "有給休暇" }
    ],
    paymentType: [
        { value: "1", label: "有償" },
        { value: "2", label: "無償" },
        { value: "3", label: "研修" }
    ]
};

/** タイムエントリのモックデータ */
export const MOCK_TIME_ENTRIES = [
    {
        id: "te-001",
        name: "システム開発",
        title: "システム開発",
        mainCategory: 1,
        timeCategory: 1,
        paymentType: 1,
        timezone: 1,
        start: "2024-01-15T09:00:00",
        end: "2024-01-15T18:00:00",
        wo: "wo-001"
    },
    {
        id: "te-002",
        name: "コードレビュー",
        title: "コードレビュー",
        mainCategory: 1,
        timeCategory: 2,
        paymentType: 1,
        timezone: 1,
        start: "2024-01-15T19:00:00",
        end: "2024-01-15T21:00:00",
        wo: "wo-002"
    }
];

/** モックデータ取得のヘルパー関数 */
export class MockDataHelper {
    /** 指定されたIDのリソースを取得 */
    static getResourceById(id: string) {
        return MOCK_RESOURCES.find(r => r.id === id);
    }

    /** 指定されたIDのサブカテゴリを取得 */
    static getSubcategoryById(id: string) {
        return MOCK_SUBCATEGORIES.find(s => s.id === id);
    }

    /** 指定されたIDのタスクを取得 */
    static getTaskById(id: string) {
        return MOCK_TASKS.find(t => t.id === id);
    }

    /** 指定されたIDのワークオーダーを取得 */
    static getWorkOrderById(id: string) {
        return MOCK_WORK_ORDERS.find(w => w.id === id);
    }

    /** 指定されたIDのタイムエントリを取得 */
    static getTimeEntryById(id: string) {
        return MOCK_TIME_ENTRIES.find(t => t.id === id);
    }

    /** ランダムなIDを生成 */
    static generateId(prefix: string = 'item'): string {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /** 指定された型のモックデータを取得 */
    static getMockData<T extends BaseEntity>(type: string): T[] {
        switch (type) {
            case 'resources':
                return MOCK_RESOURCES as unknown as T[];
            case 'subcategories':
                return MOCK_SUBCATEGORIES as unknown as T[];
            case 'tasks':
                return MOCK_TASKS as unknown as T[];
            case 'workorders':
                return MOCK_WORK_ORDERS as unknown as T[];
            case 'timeentries':
                return MOCK_TIME_ENTRIES as unknown as T[];
            default:
                return [];
        }
    }
}
