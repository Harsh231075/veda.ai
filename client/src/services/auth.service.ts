import { API_BASE_URL } from "./api.config";

export const getSetupUsersApi = async () => {
    const res = await fetch(`${API_BASE_URL}/users/setup`);
    if (!res.ok) throw new Error("Failed to setup minimal users");
    return res.json();
};
