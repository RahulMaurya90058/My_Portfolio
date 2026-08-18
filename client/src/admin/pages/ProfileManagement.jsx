import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedinIn,
  FaSave,
  FaSpinner,
  FaArrowLeft,
  FaCamera,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  name: "",
  title: "",
  bio: "",
  email: "",
  location: "",
  profileImage: "",
  github: "",
  linkedin: "",
  resumeUrl: "",
};

function ProfileManagement() {
  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const token =
    localStorage.getItem("adminToken");

  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/profile`
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load profile"
          );
        }

        if (data.profile) {
          setFormData({
            name: data.profile.name || "",
            title:
              data.profile.title || "",
            bio: data.profile.bio || "",
            email:
              data.profile.email || "",
            location:
              data.profile.location || "",
            profileImage:
              data.profile.profileImage ||
              "",
            github:
              data.profile.github || "",
            linkedin:
              data.profile.linkedin || "",
            resumeUrl:
              data.profile.resumeUrl || "",
          });
        }
      } catch (error) {
        console.error(
          "Fetch profile error:",
          error
        );

        setError(
          error.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      const profile =
        data.profile;

      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        email: profile.email || "",
        location:
          profile.location || "",
        profileImage:
          profile.profileImage || "",
        github: profile.github || "",
        linkedin:
          profile.linkedin || "",
        resumeUrl:
          profile.resumeUrl || "",
      });

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SELECT PROFILE IMAGE
  // ==========================================

  const handleImageSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image."
      );

      event.target.value = "";
      return;
    }

    // Check image size
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    // Create local preview
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setMessage("");
    setError("");
  };

  // ==========================================
  // UPLOAD PROFILE IMAGE
  // ==========================================

  const handleImageUpload =
    async () => {
      if (!selectedImage) {
        setError(
          "Please select an image first."
        );
        return;
      }

      if (!token) {
        setError(
          "Authentication required. Please login again."
        );
        return;
      }

      try {
        setUploadingImage(true);
        setMessage("");
        setError("");

        // --------------------------------------
        // Upload image to Cloudinary
        // --------------------------------------

        const uploadData =
          new FormData();

        uploadData.append(
          "image",
          selectedImage
        );

        const uploadResponse =
          await fetch(
            `${API_URL}/api/upload/image`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: uploadData,
            }
          );

        const uploadResult =
          await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult.success
        ) {
          throw new Error(
            uploadResult.message ||
              "Image upload failed."
          );
        }

        // --------------------------------------
        // Get Cloudinary image URL
        // --------------------------------------

        const imageUrl =
          uploadResult.imageUrl;

        if (!imageUrl) {
          throw new Error(
            "Image uploaded but image URL was not returned."
          );
        }

        // --------------------------------------
        // Save image URL in Profile
        // --------------------------------------

        const profileResponse =
          await fetch(
            `${API_URL}/api/profile`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },

              // IMPORTANT:
              // Use formData, NOT formDataState
              body: JSON.stringify({
                ...formData,
                profileImage:
                  imageUrl,
              }),
            }
          );

        const profileData =
          await profileResponse.json();

        if (
          !profileResponse.ok ||
          !profileData.success
        ) {
          throw new Error(
            profileData.message ||
              "Image uploaded but profile update failed."
          );
        }

        // --------------------------------------
        // Update local profile state
        // --------------------------------------

        const profile =
          profileData.profile;

        setFormData({
          name: profile.name || "",
          title:
            profile.title || "",
          bio: profile.bio || "",
          email:
            profile.email || "",
          location:
            profile.location || "",
          profileImage:
            profile.profileImage ||
            imageUrl ||
            "",
          github:
            profile.github || "",
          linkedin:
            profile.linkedin || "",
          resumeUrl:
            profile.resumeUrl || "",
        });

        // --------------------------------------
        // Clear selected image
        // --------------------------------------

        if (imagePreview) {
          URL.revokeObjectURL(
            imagePreview
          );
        }

        setSelectedImage(null);
        setImagePreview("");

        setMessage(
          "Profile picture updated successfully."
        );
      } catch (error) {
        console.error(
          "Image upload error:",
          error
        );

        setError(
          error.message ||
            "Image upload failed."
        );
      } finally {
        setUploadingImage(false);
      }
    };

  // ==========================================
  // CLEANUP PREVIEW URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <FaSpinner
          size={28}
          className="animate-spin text-cyan-400"
        />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <a
                href="/admin/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                <FaArrowLeft size={14} />
              </a>

              <div>
                <p className="text-sm font-medium text-cyan-400">
                  Admin Panel
                </p>

                <h1 className="mt-1 text-3xl font-bold">
                  Profile Management
                </h1>
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-500">
              Manage the information displayed
              on your public portfolio.
            </p>
          </div>

        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ======================================= */}

        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300"
          >
            {message}
          </motion.div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ======================================= */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          {/* ====================================
              BASIC INFORMATION
          ===================================== */}

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <FaUser />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Basic Information
                </h2>

                <p className="text-sm text-slate-500">
                  Your primary portfolio information.
                </p>
              </div>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Rahul Maurya"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                />
              </div>

              {/* Title */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Professional Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={
                    handleChange
                  }
                  placeholder="MERN Stack Developer"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="relative">

                  <FaEnvelope
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={
                      handleChange
                    }
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                </div>
              </div>

              {/* Location */}

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Location
                </label>

                <div className="relative">

                  <FaMapMarkerAlt
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Uttar Pradesh, India"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                </div>
              </div>

              {/* Bio */}

              <div className="md:col-span-2">

                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows="5"
                  value={formData.bio}
                  onChange={
                    handleChange
                  }
                  placeholder="Write a short professional introduction..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                />

              </div>

            </div>
          </section>

          {/* ====================================
              SOCIAL LINKS
          ===================================== */}

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <FaGithub />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Social Links
                </h2>

                <p className="text-sm text-slate-500">
                  Add your professional social profiles.
                </p>
              </div>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* GitHub */}

              <div>

                <label
                  htmlFor="github"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  GitHub URL
                </label>

                <div className="relative">

                  <FaGithub
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="github"
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={
                      handleChange
                    }
                    placeholder="https://github.com/username"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                </div>
              </div>

              {/* LinkedIn */}

              <div>

                <label
                  htmlFor="linkedin"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  LinkedIn URL
                </label>

                <div className="relative">

                  <FaLinkedinIn
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={
                      formData.linkedin
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                  />

                </div>
              </div>

              {/* Resume */}

              <div className="md:col-span-2">

                <label
                  htmlFor="resumeUrl"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Resume URL
                </label>

                <input
                  id="resumeUrl"
                  name="resumeUrl"
                  type="url"
                  value={
                    formData.resumeUrl
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Resume upload is managed from the Resume section.
                </p>

              </div>

            </div>
          </section>

          {/* ====================================
              PROFILE IMAGE
          ===================================== */}

          <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">

            <div>
              <h2 className="text-xl font-bold">
                Profile Picture
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a profile picture from your computer.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Preview */}

              <div className="relative">

                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-400/30 bg-slate-950">

                  {imagePreview ||
                  formData.profileImage ? (
                    <img
                      src={
                        imagePreview ||
                        formData.profileImage
                      }
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUser
                      size={40}
                      className="text-slate-600"
                    />
                  )}

                </div>

                {/* Camera */}

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg transition hover:bg-cyan-300"
                >
                  <FaCamera size={15} />

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageSelect
                    }
                    className="hidden"
                  />
                </label>

              </div>

              {/* Controls */}

              <div>

                <p className="text-sm font-medium text-white">
                  {selectedImage
                    ? selectedImage.name
                    : "Choose your profile picture"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  JPG, PNG, WEBP • Maximum 5MB
                </p>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImage
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Upload Image
                      </>
                    )}
                  </button>
                )}

              </div>

            </div>
          </section>

          {/* ====================================
              SAVE PROFILE
          ===================================== */}

          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FaSpinner
                    size={16}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave size={16} />
                  Save Profile
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default ProfileManagement;