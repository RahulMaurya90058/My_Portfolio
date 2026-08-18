import Project from "../models/Project.js";

// ==========================================
// Get All Projects
// ==========================================

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// ==========================================
// Get Single Project
// ==========================================

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// ==========================================
// Create Project
// ==========================================

export const createProject = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      technologies,
      image,
      githubUrl,
      liveUrl,
      featured,
      order,
    } = req.body;

    if (!title || !shortDescription) {
      return res.status(400).json({
        success: false,
        message:
          "Project title and short description are required",
      });
    }

    const project = await Project.create({
      title,
      shortDescription,
      description: description || "",
      technologies: Array.isArray(technologies)
        ? technologies
        : [],
      image: image || "",
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      featured: featured ?? false,
      order: order ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// ==========================================
// Update Project
// ==========================================

export const updateProject = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      technologies,
      image,
      githubUrl,
      liveUrl,
      featured,
      order,
    } = req.body;

    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.title =
      title ?? project.title;

    project.shortDescription =
      shortDescription ??
      project.shortDescription;

    project.description =
      description ?? project.description;

    project.technologies =
      technologies ?? project.technologies;

    project.image =
      image ?? project.image;

    project.githubUrl =
      githubUrl ?? project.githubUrl;

    project.liveUrl =
      liveUrl ?? project.liveUrl;

    project.featured =
      featured ?? project.featured;

    project.order =
      order ?? project.order;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// ==========================================
// Delete Project
// ==========================================

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};