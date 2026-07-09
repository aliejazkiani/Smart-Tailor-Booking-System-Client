import API from "../utils/api";

export const getNotifications = (userId) =>
  API.get(`/notifications/user/${userId}`);

export const markNotificationRead = (id) =>
  API.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = (userId) =>
  API.patch(`/notifications/user/${userId}/read-all`);

export const deleteNotification = (id) =>
  API.delete(`/notifications/${id}`);

export const getActivePromotions = (role = "customer") =>
  API.get(`/notifications/promotions/active?role=${role}`);

export const getAllPromotions = () =>
  API.get("/notifications/promotions");

export const createPromotion = (payload) =>
  API.post("/notifications/promotions", payload);

export const updatePromotion = (id, payload) =>
  API.put(`/notifications/promotions/${id}`, payload);

export const deletePromotion = (id) =>
  API.delete(`/notifications/promotions/${id}`);

export const broadcastPromotion = (id) =>
  API.post(`/notifications/promotions/${id}/broadcast`);
