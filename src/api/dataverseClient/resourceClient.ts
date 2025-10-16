import { getXrm } from "../../utils/xrmUtils";

/**
 * Bookable Resource（リソース）APIクライアント
 */
export const resourceClient = {
    async getResources(): Promise<{ id: string; number: string; name: string }[]> {
        const xrm = getXrm();

        // ✅ ローカル開発用モック
        if (!xrm) {
            return [
                { id: "1", number: "0001", name: "田中 太郎" },
                { id: "2", number: "0002", name: "佐藤 花子" },
                { id: "3", number: "0003", name: "鈴木 次郎" },
            ];
        }

        try {
            // Dataverseから proto_bookableresource を取得
            const result = await xrm.WebApi.retrieveMultipleRecords(
                "proto_bookableresource",
                "?$select=proto_bookableresourceid,proto_sei,proto_mei,proto_shimei,proto_name"
            );

            return result.entities.map((r: any) => ({
                id: r.proto_bookableresourceid,
                lastname: r.proto_sei ?? "",
                firstname: r.proto_mei ?? "",
                fullname: r.proto_shimei ?? "",
                // systemuser: r.proto_systemuser ?? "",
                name: r.proto_name ?? "",
                // resoursetype: r.proto_resoursetype ?? "",
            }));
        } catch (error) {
            console.error("❌ リソース取得失敗:", error);
            return [];
        }
    },
};
