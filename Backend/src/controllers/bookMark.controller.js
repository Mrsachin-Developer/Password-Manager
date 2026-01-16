import { MarkerSchema } from "../models/bookMark.model.js";

const addMark = async (req, res) => {
  try {
    const { title, url, tags, isFavorite } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        message: "Please provide title and url",
        success: false,
      });
    }

    const newMark = await MarkerSchema.create({
      title,
      url,
      tags,
      isFavorite,
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Bookmark added successfully",
      success: true,
      data: newMark,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add bookmark",
      success: false,
      error: error.message,
    });
  }
};

const deleteMark = async (req, res) => {
  try {
    const { id } = req.params;

    const mark = await MarkerSchema.findById(id);

    if (!mark) {
      return res.status(404).json({
        message: "BookMark is not found",
        success: false,
      });
    }

    if (mark.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not Authorized to delete the Bookmark",
        success: false,
      });
    }

    await mark.deleteOne();
    return res.status(200).json({
      message: "BookMark is deleted",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete BookMark",
      success: false,
      error: error.message,
    });
  }
};

const updateMark = async (req, res) => {
  try {
    const { id } = req.params;

    const mark = await MarkerSchema.findById(id);

    if (!mark) {
      return res.status(404).json({
        message: "BookMark is not found",
        success: false,
      });
    }

    if (mark.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not Authorized to update",
        success: false,
      });
    }

    const { title, url, tags, isFavorite } = req.body;

    if (title !== undefined) mark.title = title;
    if (url !== undefined) mark.url = url;
    if (tags !== undefined) mark.tags = tags;
    if (isFavorite !== undefined) mark.isFavorite = isFavorite;

    await mark.save();

    return res.status(200).json({
      message: "BookMark is updated",
      success: true,
      data: mark,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to Update the BookMark",
      success: false,
    });
  }
};
const getMarks = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Validate query params
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const { tag, favorite, search, sort = "createdAt" } = req.query;

    // Base query (ownership)
    const query = { user: userId };

    // Filtering
    if (tag) {
      query.tags = tag;
    }

    if (favorite !== undefined) {
      query.isFavorite = favorite === "true";
    }

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { url: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch paginated results
    const marks = await MarkerSchema.find(query)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(limit);

    // Count total
    const total = await MarkerSchema.countDocuments(query);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalResults: total,
      totalPages: Math.ceil(total / limit),
      data: marks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
    });
  }
};

const getMarkById = async (req, res) => {
  try {
    const mark = await MarkerSchema.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!mark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: mark,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid bookmark ID",
    });
  }
};

export { addMark, deleteMark, updateMark, getMarkById, getMarks };
