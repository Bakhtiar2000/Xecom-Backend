import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: ResponseMeta;
    data: T | null | undefined;
  },
) => {
  res.status(jsonData.statusCode).json({
    statusCode: jsonData.statusCode,
    success: jsonData.success,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
  });
};

export default sendResponse;

export interface ResponseMeta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: ResponseMeta;
  data: T | null;
}
