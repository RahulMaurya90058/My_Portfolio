import Profile from "../models/Profile.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// Create or Update Profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      email,
      location,
      profileImage,
      github,
      linkedin,
      resumeUrl,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    let profile = await Profile.findOne();

    if (profile) {
      profile.name = name;
      profile.title = title || "";
      profile.bio = bio || "";
      profile.email = email || "";
      profile.location = location || "";
      profile.profileImage = profileImage || "";
      profile.github = github || "";
      profile.linkedin = linkedin || "";
      profile.resumeUrl = resumeUrl || "";

      await profile.save();
    } else {
      profile = await Profile.create({
        name,
        title,
        bio,
        email,
        location,
        profileImage,
        github,
        linkedin,
        resumeUrl,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};