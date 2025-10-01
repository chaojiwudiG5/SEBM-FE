declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseBorrowRecordVo = {
    code?: number;
    data?: BorrowRecordVo;
    message?: string;
  };

  type BaseResponseDeviceVo = {
    code?: number;
    data?: DeviceVo;
    message?: string;
  };

  type BaseResponseListBorrowRecordVo = {
    code?: number;
    data?: BorrowRecordVo[];
    message?: string;
  };

  type BaseResponseListDeviceVo = {
    code?: number;
    data?: DeviceVo[];
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

  type BorrowRecordAddDto = {
    deviceId: number;
    borrowTime: string;
    dueTime: string;
    remarks?: string;
  };

  type BorrowRecordQueryDto = {
    pageNumber: number;
    pageSize: number;
    userId: number;
  };

  type BorrowRecordQueryWithStatusDto = {
    pageNumber: number;
    pageSize: number;
    userId: number;
    status: number;
  };

  type BorrowRecordReturnDto = {
    id: number;
    latitude: string;
    longitude: string;
    returnTime: string;
    remarks?: string;
  };

  type BorrowRecordVo = {
    id?: number;
    userId?: number;
    userName?: string;
    deviceId?: number;
    deviceName?: string;
    image?: string;
    borrowTime?: string;
    dueTime?: string;
    returnTime?: string;
    status?: number;
    remarks?: string;
  };

  type DeleteDto = {
    id: number;
  };

  type DeviceAddDto = {
    deviceName: string;
    deviceType: string;
    status: number;
    location: string;
    description?: string;
    image?: string;
  };

  type DeviceQueryDto = {
    pageNumber: number;
    pageSize: number;
    deviceName?: string;
    deviceType?: string;
    status?: number;
    location?: string;
  };

  type DeviceUpdateDto = {
    id: number;
    deviceName: string;
    deviceType: string;
    status: number;
    location: string;
    description?: string;
    image?: string;
  };

  type DeviceVo = {
    id?: number;
    deviceName?: string;
    deviceType?: string;
    status?: number;
    location?: string;
    description?: string;
    image?: string;
  };

  type getDeviceParams = {
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

  type updateDeviceStatusParams = {
    deviceId: number;
    status: number;
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
    level?: number;
    overdueTimes?: number;
    borrowedDeviceCount?: number;
    maxBorrowedDeviceCount?: number;
    maxOverdueTimes?: number;
    createTime?: string;
    updateTime?: string;
    token?: string;
    active?: boolean;
  };
}
