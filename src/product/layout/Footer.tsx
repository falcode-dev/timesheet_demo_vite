import "./Footer.css";
import * as FaIcons from "react-icons/fa";
import { Button } from "../../component/button/Button";

interface FooterProps {
    onOpenUserList: () => void;
    onOpenFavoriteTask: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenUserList, onOpenFavoriteTask }) => (
    <div className="content-bottom">
        <div className="content-bottom-left">
            <Button label="ユーザー 一覧設定" color="secondary" icon={<FaIcons.FaUser />} onClick={onOpenUserList} />
            <Button label="お気に入り間接タスク設定" color="secondary" icon={<FaIcons.FaStar />} onClick={onOpenFavoriteTask} />
        </div>
        <div className="content-bottom-right">
            <button className="menu-button" title="その他">
                <FaIcons.FaEllipsisV />
            </button>
        </div>
    </div>
);
