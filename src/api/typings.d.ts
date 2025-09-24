declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageUserVo = {
    code?: number;
    data?: PageUserVo;
    message?: string;
  };

  type BaseResponseUserVo = {
    code?: number;
    data?: UserVo;
    message?: string;
  };

  type DeleteDto = {
    id: number;
  };

  type LoginDto = {
    username: string;
    password: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageDto = {
    pageNumber: number;
    pageSize: number;
  };

  type PageUserVo = {
    records?: UserVo[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserVo;
    searchCount?: PageUserVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type RegisterDto = {
    username: string;
    password: string;
    checkPassword: string;
    phone: string;
  };

  type UpdateDto = {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    gender: number;
    age?: number;
  };

  type UserVo = {
    id?: number;
    username?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatarUrl?: string;
    userRole?: number;
    userStatus?: number;
    age?: number;
    createTime?: string;
    updateTime?: string;
    active?: boolean;
  };
}
