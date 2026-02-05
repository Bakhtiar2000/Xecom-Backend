type TOptions = {
  page?: number;
  take?: number;
  sortOrder?: string;
  sortBy?: string;
};

type TOptionsResult = {
  page: number;
  take: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const calculatePagination = (options: TOptions): TOptionsResult => {
  const page: number = Number(options.page) || 1;
  const take: number = Number(options.take) || 10;
  const skip: number = Number((page - 1) * take);
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return {
    page,
    take,
    skip,
    sortBy,
    sortOrder,
  };
};

export default calculatePagination;
