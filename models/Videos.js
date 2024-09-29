const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const videoSchema = Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    videoUrl: { type: String, required: true },
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
      enum: [
        "adhesive",
        "brick",
        "glass",
        "glitter",
        "metal",
        "paper",
        "plastic",
        "porcelain",
        "sand",
        "washi",
        "wood",
      ],
    },
    difficulty: { type: Date, enum: ["easy", "medium", "hard"] },
    tool: {
      type: Date,
      enum: [
        "drill",
        "hammer",
        "saw",
        "nail_gun",
        "scissors",
        "knife",
        "clamp",
        "screw",
        "plier",
        "tap_measure",
        "sander",
      ],
    },
    rating: { type: Number, default: 0 },
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
