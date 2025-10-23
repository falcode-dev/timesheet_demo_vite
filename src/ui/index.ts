/**
 * UIコンポーネント統合エクスポート
 * 基本コンポーネントとレイアウトコンポーネントを一箇所から提供
 */

// 基本UIコンポーネント
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Select } from './components/Select';
export { Tabs } from './components/Tabs';
export { Textarea } from './components/Textarea';

// レイアウトコンポーネント
export { Header } from './layout/Header';
export { Sidebar } from './layout/Sidebar';
export { ContentHeader } from './layout/ContentHeader';
export { Footer } from './layout/Footer';

// 型定義は types/components から再エクスポート
export type {
    ButtonProps,
    InputProps,
    SelectProps,
    TabsProps,
    TextareaProps,
    HeaderProps,
    SidebarProps,
    ContentHeaderProps,
    FooterProps
} from '../types/components';
