import * as mongoose from 'mongoose';

export const VersionSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      index: true,
      required: true,
    },
    hash: {
      type: String,
      index: true,
      maxlength: 32,
      unique: true,
    },
    commonHash: {
      type: String,
      index: true,
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
