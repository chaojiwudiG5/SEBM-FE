declare namespace API {
  type addMaintenanceTaskParams = {
    userMaintenanceRecordId: number;
    mechanicId: number;
  };

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

  type BaseResponseListUserMaintenanceRecordVo = {
    code?: number;
    data?: UserMaintenanceRecordVo[];
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseMapStringString = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseMechanicanMaintenanceRecordVo = {
    code?: number;
    data?: MechanicanMaintenanceRecordVo;
    message?: string;
  };

  type BaseResponsePageMechanicanMaintenanceRecordVo = {
    code?: number;
    data?: PageMechanicanMaintenanceRecordVo;
    message?: string;
  };

  type BaseResponsePageTemplateVo = {
    code?: number;
    data?: PageTemplateVo;
    message?: string;
  };

  type BaseResponsePageUserVo = {
    code?: number;
    data?: PageUserVo;
    message?: string;
  };

  type BaseResponseTemplateVo = {
    code?: number;
    data?: TemplateVo;
    message?: string;
  };

  type BaseResponseUserMaintenanceRecordVo = {
    code?: number;
    data?: UserMaintenanceRecordVo;
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

  type CreateTemplateDto = {
    templateTitle: string;
    templateType: string;
    notificationNode: number;
    notificationMethod: number[];
    relateTimeOffset?: number;
    content: string;
    notificationRole?: number;
    notificationEvent?: number;
    notificationType?: number;
    templateDesc?: string;
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

  type getRecordDetail1Params = {
    id: number;
  };

  type getTemplateDetailParams = {
    templateId: number;
  };

  type getUploadUrlParams = {
    filename: string;
    contentType: string;
  };

  type LoginDto = {
    username: string;
    password: string;
  };

  type MechanicanMaintenanceRecordVo = {
    id?: number;
    deviceId?: number;
    userId?: number;
    description?: string;
    image?: string;
    status?: number;
    createTime?: string;
    updateTime?: string;
    userMaintenanceRecordId?: number;
  };

  type MechanicanQueryDto = {
    pageNumber: number;
    pageSize: number;
    deviceId?: number;
    status?: number;
  };

  type MechanicanUpdateDto = {
    id: number;
    status: number;
    description?: string;
    image?: string;
    userMaintenanceRecordId: number;
  };

  type MechanicRecordQueryDto = {
    deviceId: number;
    status: number;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageDto = {
    pageNumber: number;
    pageSize: number;
  };

  type PageMechanicanMaintenanceRecordVo = {
    records?: MechanicanMaintenanceRecordVo[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageMechanicanMaintenanceRecordVo;
    searchCount?: PageMechanicanMaintenanceRecordVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageTemplateVo = {
    records?: TemplateVo[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageTemplateVo;
    searchCount?: PageTemplateVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
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

  type TemplateQueryDto = {
    pageNumber: number;
    pageSize: number;
    templateTitle?: string;
    notificationNode?: number;
    notificationMethod?: number;
    status?: string;
    userId?: number;
  };

  type TemplateVo = {
    id?: number;
    templateTitle?: string;
    templateType?: string;
    templateDesc?: string;
    notificationRole?: number;
    notificationType?: number;
    notificationEvent?: number;
    content?: string;
    status?: string;
    createTime?: string;
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

  type UserCreateDto = {
    borrowRecordId: number;
    description: string;
    image: string;
  };

  type UserMaintenanceRecordVo = {
    id?: number;
    deviceName?: string;
    userId?: number;
    description?: string;
    image?: string;
    status?: number;
    createTime?: string;
    updateTime?: string;
  };

  type UserQueryDto = {
    pageNumber: number;
    pageSize: number;
    status?: number;
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
