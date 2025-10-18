import multer, { type StorageEngine } from "multer";
import type { Request } from "express";
import path from "path";
import fs from "fs";

const tempDir = path.resolve("public/temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage: StorageEngine = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, tempDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    // ✅ Get extension safely
    const ext = path.extname(file.originalname); // e.g. ".jpg"
    const baseName = path.basename(file.originalname, ext); // e.g. "avatar"
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // ✅ Sanitize and join filename
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`); // avatar-123456789.png
  },
});

export const upload = multer({ storage });
