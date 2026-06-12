import { type Request } from "express";

const buildFileUrl = (req: Request, filename: string): string => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

export default buildFileUrl;
