const { catchAsync, sendResponse } = require("../helpers/utils");
const Users = require("../models/Users");
const Videos = require("../models/Videos");

const videosController = {};

videosController.createVideo = catchAsync(async (req, res, next) => {
  const {
    user_id,
    title,
    description,
    category,
    collection,
    videoUrl,
    duration,
    material,
    difficulty,
    tool,
  } = req.body;

  const viewInitial = Math.floor(Math.random() * 200);

  video = await Videos.create({
    author: user_id,
    title,
    description,
    category,
    collection,
    videoUrl,
    duration,
    material,
    difficulty,
    tool,
    rating: [],
    view: viewInitial,
  });

  return sendResponse(
    res,
    200,
    true,
    {},
    null,
    "Successfully! Your video is created"
  );
});

videosController.getVideo = catchAsync(async (req, res, next) => {
  let {
    page,
    limit,
    title: queryTitle,
    category,
    collection,
    duration,
    material,
    difficulty,
    tool,
  } = req.query;
  console.log(
    "🐳 Helen 🍄 -- videosController.getVideo=catchAsync -- material:",
    material
  );
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 9;
  const offset = limit * (page - 1);

  let filter = [];
  if (queryTitle) {
    filter.push({
      title: { $regex: ".*" + RegexEscape(queryTitle) + ".*", $options: "i" },
    });
  }
  if (category) {
    filter.push({ category });
  }
  if (collection) {
    filter.push({ collection });
  }
  if (duration) {
    filter.push({ duration });
  }
  if (material) {
    filter.push({ material: { $all: material.split(",") } });
  }
  if (difficulty) {
    filter.push({ difficulty });
  }
  if (tool) {
    filter.push({ tool: { $all: tool.split(",") } });
  }

  if (filter.length === 0) filter = {};
  else if (filter.length === 1) filter = filter[0];
  else filter = { $and: filter };

  // console.log("filter", JSON.stringify(filter));

  const count = await Videos.countDocuments(filter);
  const totalPage = Math.ceil(count / limit);
  let searchVideos = await Videos.find(filter)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("author");
  searchVideos.map((i) => console.log(i));
  return sendResponse(
    res,
    200,
    true,
    { searchVideos, totalPage },
    null,
    "Successful"
  );
});

videosController.getVideoById = catchAsync(async (req, res) => {
  const { id } = req.params;
  let video = await Videos.findById(id).populate("author");

  return sendResponse(res, 200, true, video, null, "successful");
});

videosController.getVideosByUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 9;
  const offset = limit * (page - 1);

  let videoList = await Videos.find({ author: id })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("author");
  const totalPage = Math.ceil(videoList.length / limit);

  return sendResponse(
    res,
    200,
    true,
    { videoList, totalPage },
    null,
    "successful"
  );
});

videosController.updateVideo = catchAsync(async (req, res) => {
  const { id } = req.params;
  let video = await Videos.findByIdAndUpdate(id, {
    ...req.body,
  });
  video = await video.save();
  return sendResponse(res, 200, true, video, null, "Update successful");
});

videosController.deleteVideo = catchAsync(async (req, res) => {
  const { id } = req.params;
  let newList = await Videos.findOneAndDelete({ _id: id });

  return sendResponse(res, 200, true, {}, null, "Delete successful");
});

videosController.updateView = catchAsync(async (req, res) => {
  const { id } = req.params;
  let video = await Videos.findById(id);
  console.log(
    "🐳 Helen 🍄 -- videosController.updateView=catchAsync -- video:",
    video
  );
  video.view += 1;
  video = await video.save();
  return sendResponse(res, 200, true, {}, null, "Success");
});

videosController.updateRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(
    "🐳 Helen 🍄 -- videosController.updateRating=catchAsync -- id:",
    id
  );
  const { userId } = req.body;
  let video = await Videos.findById(id);
  console.log(
    "🐳 Helen 🍄 -- videosController.updateRating=catchAsync -- video:",
    video
  );
  const newRating = video.rating;
  const founded = newRating?.find((item) => item === userId);
  if (founded) {
    const index = newRating.indexOf(userId);
    newRating.splice(index, 1);
  } else {
    newRating.push(userId);
  }
  video.rating = newRating;
  video = await video.save();
  return sendResponse(res, 200, true, {}, null, "Success");
});

module.exports = videosController;
