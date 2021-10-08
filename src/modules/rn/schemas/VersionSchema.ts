import * as mongoose from 'mongoose';

export const VersionSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    hash: {
      type: String,
      maxlength: 32,
      unique: true,
    },
    commonHash: {
      type: String,
      maxlength: 32,
      required: true,
    },
    isCommon: {
      type: Boolean,
      default: false,
    },
    componentName: {
      type: String,
      index: true,
      maxlength: 64,
    },
    downloadUrl: {
      type: String,
    },
    buildTime: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

VersionSchema.index(
  { platform: 1, version: 1, commonHash: 1 },
  { unique: true },
);
