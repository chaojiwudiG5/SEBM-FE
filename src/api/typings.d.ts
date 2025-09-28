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

  type BaseResponseReservationVo = {
    code?: number;
    data?: ReservationVo;
    message?: string;
  };

  type BaseResponseUserVo = {
    code?: number;
    data?: UserVo;
    message?: string;
  };

  type BorrowRecordAddDto = {
    deviceId: string;
    borrowTime: string;
    dueTime: string;
    remarks?: string;
  };

  type BorrowRecordQueryDto = {
    pageNumber: number;
    pageSize: number;
    userId: string;
  };

  type BorrowRecordQueryWithStatusDto = {
    pageNumber: number;
    pageSize: number;
    userId: string;
    status: number;
  };

  type BorrowRecordReturnDto = {
    id: string;
    returnTime?: string;
    remarks?: string;
  };

  type BorrowRecordVo = {
    id?: string;
    userId?: string;
    userName?: string;
    deviceId?: string;
    deviceName?: string;
    image?: string;
    borrowTime?: string;
    dueTime?: string;
    returnTime?: string;
    status?: number;
    remarks?: string;
  };

  type DeleteDto = {
    id: string;
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
    id: string;
    deviceName: string;
    deviceType: string;
    status: number;
    location: string;
    description?: string;
    image?: string;
  };

  type DeviceVo = {
    id?: string;
    deviceName?: string;
    deviceType?: string;
    status?: number;
    location?: string;
    description?: string;
    image?: string;
  };

  type getDeviceParams = {
    id: string;
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

  type ReservationAddDto = {
    deviceId?: string;
    reserveStart?: string;
    reserveEnd?: string;
    remarks?: string;
  };

  type ReservationVo = {
    id?: string;
    userId?: string;
    userName?: string;
    deviceId?: string;
    deviceName?: string;
    reserveStart?: string;
    reserveEnd?: string;
    status?: number;
    statusDesc?: string;
    remarks?: string;
  };

  type reserveDeviceParams = {
    reservationAddDto: ReservationAddDto;
  };

  type updateDeviceStatusParams = {
    deviceId: string;
    status: number;
  };

  type UpdateDto = {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    gender: number;
    age?: number;
  };

  type UserVo = {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatarUrl?: string;
    userRole?: number;
    userStatus?: number;
    age?: number;
    token?: string;
    overdueTimes?: number;
    borrowedDeviceCount?: number;
    reservedDeviceCount?: number;
    maxBorrowedDeviceCount?: number;
    maxOverdueTimes?: number;
    maxReservedDeviceCount?: number;
    level?: number;
    active?: boolean;
  };
}
