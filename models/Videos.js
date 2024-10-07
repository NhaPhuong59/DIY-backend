const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const videoSchema = Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    videoUrl: { type: String, required: true },
    view: { type: Number },
    category: {
      type: String,
      enum: [
        "clothes",
        "accessories",
        "furniture",
        "home",
        "jewelry",
        "kid",
        "pottery",
        "art",
      ],
    },
    collection: {
      type: String,
      enum: [
        "christmas",
        "soap",
        "earings",
        "vases",
        "candle",
        "art",
        "necklace",
        "chairs",
      ],
    },
    duration: {
      type: String,
      enum: ["2h", "4h", "8h", "12h", "2d", "3d", "4d"],
    },
    material: {
      type: String,
    },

    // enum: [
    //   "adhesive",
    //   "brick",
    //   "glass",
    //   "glitter",
    //   "metal",
    //   "paper",
    //   "plastic",
    //   "porcelain",
    //   "sand",
    //   "washi",
    //   "wood",
    // ],
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    tool: {
      type: String,
    },

    // enum: [
    //   "drill",
    //   "hammer",
    //   "saw",
    //   "nail_gun",
    //   "scissors",
    //   "knife",
    //   "clamp",
    //   "screw",
    //   "plier",
    //   "tap_measure",
    //   "sander",
    // ],
    rating: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

videoSchema.methods.toJSON = function () {
  const obj = this._doc;
  return obj;
};

const Videos = mongoose.model("Videos", videoSchema);

module.exports = Videos;
