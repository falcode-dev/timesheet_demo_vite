import { dataverseClient } from "../api/dataverseClient";

export const useTimeEntryHandler = (onSuccess?: () => void) => {
    const handleTimeEntrySubmit = async (data: any, events: any[]) => {
        try {
            const isUpdate = data.id && events.some((ev) => ev.id === data.id);
            const result = isUpdate
                ? await dataverseClient.updateTimeEntry(data.id, data)
                : await dataverseClient.createTimeEntry(data);

            console.log("✅ 登録・更新完了:", result);
            onSuccess?.();
        } catch (err) {
            console.error("❌ 登録・更新失敗:", err);
            alert("保存に失敗しました。");
        }
    };

    return { handleTimeEntrySubmit };
};
