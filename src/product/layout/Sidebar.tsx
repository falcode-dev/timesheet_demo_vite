import "./Sidebar.css";
import * as FaIcons from "react-icons/fa";
import { Input } from "../../component/input/Input";

interface SidebarProps {
    userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName }) => (
    <aside className="sidebar-container">
        <h2 className="sidebar-title">検索</h2>

        <div className="sidebar-radios">
            <label>
                <input type="radio" name="searchType" value="name" defaultChecked /> ユーザー名
            </label>
            <label>
                <input type="radio" name="searchType" value="number" /> 社員番号
            </label>
        </div>

        <Input placeholder="ユーザー名を入力" className="sidebar-input" />

        <div className="sidebar-self">
            <div className="sidebar-self-top">
                <input type="checkbox" checked readOnly className="sidebar-self-checkbox" />
                <div className="sidebar-self-text">
                    <span className="sidebar-self-number">社員番号（自分）</span>
                    <span className="sidebar-self-roman">{userName || "未取得"}</span>
                </div>
            </div>

            <div className="sidebar-self-divider">
                <FaIcons.FaChevronDown className="sidebar-self-icon" />
                <span className="sidebar-self-label">ユーザー名</span>
                <FaIcons.FaTasks className="sidebar-self-icon" />
            </div>
        </div>
    </aside>
);
