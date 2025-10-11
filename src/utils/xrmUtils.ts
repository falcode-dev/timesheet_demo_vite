/**
 * モデル駆動型アプリ（Dataverse）の Web リソース上で、
 * Xrm オブジェクトを安全に取得するユーティリティ関数。
 * 
 * Xrm は通常「親フレーム（parent）」または「現在のウィンドウ」
 * に存在するため、両方をチェックして返します。
 * 
 * 【使用例】
 * const xrm = getXrm();
 * if (xrm) {
 *   const userId = xrm.Utility.getGlobalContext().userSettings.userId;
 * }
 * 
 * 【戻り値】
 * - Xrm オブジェクト（取得成功時）
 * - null（取得できなかった場合）
 */
export const getXrm = (): any | null => {
    try {
        // ブラウザ環境でのみ動作させる（SSR防止）
        if (typeof window !== "undefined") {
            const win = window as any;

            // モデル駆動型アプリ内でWebリソースがiframeに埋め込まれている場合
            // 通常は親フレームに Xrm が存在する
            if (win.parent?.Xrm) return win.parent.Xrm;

            // ローカル動作や一部特殊ケースでは、現在のウィンドウに直接存在することもある
            if (win.Xrm) return win.Xrm;
        }

        // Xrmが存在しない場合（例：ローカル開発環境）
        // return null にしてアプリ側でフォールバック処理を行う
        // console.warn("Xrm 環境が見つかりません（ローカル開発モード）。");
        return null;
    } catch (err) {
        // 万が一、window参照でエラーが発生した場合にも安全に処理を終了
        console.error("Xrm 取得中にエラーが発生しました。：", err);
        return null;
    }
};
