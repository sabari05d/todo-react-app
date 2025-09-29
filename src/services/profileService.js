import api from "../api";

// profileService.js
const PROFILE_KEY = "userProfile";
const IMAGE_KEY = "profileImage";

export const getProfile = async () => {
    try {
        // Call Laravel API
        const { data } = await api.get("/profile");

        // Save to localStorage for caching
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

        return data;
    } catch (error) {
        console.error("Error fetching profile, using localStorage:", error);

        // Fallback to localStorage if API fails
        const profile = localStorage.getItem(PROFILE_KEY);
        return profile ? JSON.parse(profile) : {
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            address: "",
            theme: "Light",
        };
    }
};


export const saveProfile = async (profile) => {
    const { data } = await api.post("/save-profile", profile);

    // Save returned data in localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data.user));

    return data.user;
};

export const getProfileImage = async () => {
    const { data } = await api.get("/profile");
    return data.profile_image || null;
};

export const saveProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const { data } = await api.post("/save-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data.profileImage; // return URL
};

export const deleteProfileImage = async () => {
    await api.delete("/delete-profile-image");
    return null;
};