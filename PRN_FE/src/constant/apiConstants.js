// Localhost

export const API_BASE_URL = "https://localhost:7223/api";


export const API_ENDPOINTS = {
  AC_CHGPWD: `${API_BASE_URL}/Account/ChgPwd`,
  AC_SIGN_IN: `${API_BASE_URL}/Account/SignIn`,
  AC_SIGN_UP: `${API_BASE_URL}/Account/SignUp`,
  AC_PROFILE: `${API_BASE_URL}/Account/profile`,
  AC_UPDATE_PROF: `${API_BASE_URL}/Account/UpdateProf`,
  AC_CREATE_HOST: `${API_BASE_URL}/Account/CreateHost`,
  AC_UPLOAD_AVATAR: `${API_BASE_URL}/Account/Upload`,

  R_ALL: `${API_BASE_URL}/Room/All`,
  R_SEARCH: `${API_BASE_URL}/Room/Search`,
  R_CREATE: `${API_BASE_URL}/Room/Create`,
  GET_ROOM_BY_ID: `${API_BASE_URL}/Room/`,
  UPDATE_ROOM: `${API_BASE_URL}/Room/Update/`,
  GET_ROOM_OWNER: `${API_BASE_URL}/Room/GetRooms`,

  REGION_PROVINCE: `${API_BASE_URL}/Region/provinces`,
  REGION_DISTRICT: `${API_BASE_URL}/Region/districts/`,
  REGION_WARD: `${API_BASE_URL}/Region/wards/`,

  FEATURE_ALL: `${API_BASE_URL}/Feature/All`,
  FEATURE_BY_ROOM_ID: `${API_BASE_URL}/Feature/get-by-rid/`,

  UPLOAD_IMAGES: `${API_BASE_URL}/Media/Upload/`,
  UPLOAD_THUMBNAIL: `${API_BASE_URL}/Media/upload_thumbnail/`,
  GET_MEDIA_ROOM: `${API_BASE_URL}/Media/`,

  PAYMENT_LIST_TYPE: `${API_BASE_URL}/Payment_Status/All`,
  PAYMENT_METHOD: `${API_BASE_URL}/Payment_Status/All`,
  QR_GENERATE: `${API_BASE_URL}/qr/generate`,

  GET_BOOKING_SCHEDULE: `${API_BASE_URL}/Booking/get-schedule/`,
  CREATE_BOOKING: `${API_BASE_URL}/Booking/create`,
  GET_LIST_BOOKING: `${API_BASE_URL}/Booking/get-bookings`,
  CANCEL_BOOKING: `${API_BASE_URL}/Booking/cancel-booking/`,
  CONFIRM_BOOKING: `${API_BASE_URL}/Booking/confirm-booking/`,
  MY_BOOKING: `${API_BASE_URL}/Booking/my-bookings`,
  CHECK_IN: `${API_BASE_URL}/Booking/check-in/`,
  CHECK_OUT: `${API_BASE_URL}/Booking/check-out/`,
  GET_BOOKING_STATUSCOUNT: `${API_BASE_URL}/Booking/get-bookingstatus`,
};

export const VARIABLE = {
  HOST: "Host",
  CUSTOMER: "Customer",
};
