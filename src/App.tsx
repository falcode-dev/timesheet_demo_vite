import { useEffect, useState } from "react";
import { getXrm } from "./utils/xrmUtils";
import "./App.css";

type UserInfo = {
  userId: string;
  userName: string;
  organizationName: string;
};

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isDataverse, setIsDataverse] = useState(false);

  useEffect(() => {
    const xrm = getXrm();
    if (!xrm) {
      console.log("🧩 ローカル環境で実行中");
      return; // Dataverse外（ローカル）
    }

    try {
      const context = xrm.Utility.getGlobalContext();
      const userId = context.userSettings.userId.replace(/[{}]/g, "");
      const userName = context.userSettings.userName;
      const organizationName = context.organizationSettings.uniqueName;

      setUserInfo({ userId, userName, organizationName });
      setIsDataverse(true);
    } catch (error) {
      console.error("❌ ユーザー情報の取得に失敗しました：", error);
    }
  }, []);

  return (
    <div className="app-container">
      <h1>Dataverse ユーザー情報</h1>
      <hr />

      {isDataverse && userInfo ? (
        <div className="user-info">
          <p><strong>ユーザー名：</strong>{userInfo.userName}</p>
          <p><strong>ユーザーID：</strong>{userInfo.userId}</p>
          <p><strong>組織名：</strong>{userInfo.organizationName}</p>
        </div>
      ) : (
        <p style={{ color: "#666" }}>🌐 現在はローカル環境で実行中です。</p>
      )}
    </div>
  );
}

export default App;
