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

  const userInformation = await Users.findById(user_id);

  video = await Videos.create({
    user_id,
    userName: {
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
    },
    title,
    description,
    category,
    collection,
    videoUrl,
    duration,
    material,
    difficulty,
    tool,
    rating: null,
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
    filter.push({ material });
  }
  if (difficulty) {
    filter.push({ difficulty });
  }
  if (tool) {
    filter.push({ tool });
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
    .sort({ createdAt: -1 });
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
  let video = await Videos.findById(id);

  return sendResponse(res, 200, true, video, null, "successful");
});

videosController.getVideosByUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 9;
  const offset = limit * (page - 1);

  let videoList = await Videos.find({ id })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
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

module.exports = videosController;
