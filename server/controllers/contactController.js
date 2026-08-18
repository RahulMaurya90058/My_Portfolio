import Contact from "../models/Contact.js";

// ==========================================
// CREATE CONTACT MESSAGE - PUBLIC
// ==========================================

export const createContact = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // Validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      isRead: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.error(
      "Create contact error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send message",
    });
  }
};

// ==========================================
// GET ALL CONTACT MESSAGES - ADMIN
// ==========================================

export const getContacts = async (
  req,
  res
) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(
      "Get contacts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch messages",
    });
  }
};

// ==========================================
// GET SINGLE CONTACT - ADMIN
// ==========================================

export const getContact = async (
  req,
  res
) => {
  try {
    const contact =
      await Contact.findById(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error(
      "Get contact error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch message",
    });
  }
};

// ==========================================
// MARK AS READ / UNREAD - ADMIN
// ==========================================

export const updateContactStatus =
  async (req, res) => {
    try {
      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      const isRead =
        req.body.isRead === true ||
        req.body.isRead === "true";

      contact.isRead = isRead;

      await contact.save();

      return res.status(200).json({
        success: true,
        message: isRead
          ? "Message marked as read"
          : "Message marked as unread",
        contact,
      });
    } catch (error) {
      console.error(
        "Update contact status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update message status",
      });
    }
  };

// ==========================================
// DELETE CONTACT - ADMIN
// ==========================================

export const deleteContact = async (
  req,
  res
) => {
  try {
    const contact =
      await Contact.findById(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await Contact.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Message deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete contact error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete message",
    });
  }
};