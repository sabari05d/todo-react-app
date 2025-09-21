// profileService.js
const PROFILE_KEY = "userProfile";
const IMAGE_KEY = "profileImage";

export const getProfile = async () => {
    const profile = localStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        theme: "Light",
    };
};

export const saveProfile = async (profile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
};

export const getProfileImage = async () => {
    return localStorage.getItem(IMAGE_KEY) || null;
};

export const saveProfileImage = async (base64) => {
    localStorage.setItem(IMAGE_KEY, base64);
    return base64;
};

export const deleteProfileImage = async () => {
    localStorage.removeItem(IMAGE_KEY);
    return null;
};
