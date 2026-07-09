import API from "../utils/api";

export const submitReview = (payload) =>
  API.post("/reviews", payload);

export const getTailorReviews = (tailorId) =>
  API.get(`/reviews/tailor/${tailorId}`);

export const getShopRating = (shopId) =>
  API.get(`/reviews/shop/${shopId}/rating`);

export const getCustomerReviews = (customerId) =>
  API.get(`/reviews/customer/${customerId}`);

export const getOrderReview = (orderId) =>
  API.get(`/reviews/order/${orderId}`);

export const reportReview = (reviewId, reason) =>
  API.post(`/reviews/${reviewId}/report`, { reason });

export const replyToReview = (reviewId, text) =>
  API.post(`/reviews/${reviewId}/reply`, { text });

export const submitCustomerFeedback = (payload) =>
  API.post("/reviews/customer-feedback", payload);

export const getTailorCustomerFeedback = (tailorId) =>
  API.get(`/reviews/customer-feedback/tailor/${tailorId}`);

export const getOrderCustomerFeedback = (orderId) =>
  API.get(`/reviews/customer-feedback/order/${orderId}`);

export const getCustomerReceivedFeedback = (customerId) =>
  API.get(`/reviews/customer-feedback/customer/${customerId}`);

export const dismissReportedReview = (reviewId) =>
  API.patch(`/admin/reviews/${reviewId}/dismiss`);

export const deleteReview = (reviewId) =>
  API.delete(`/admin/reviews/${reviewId}`);

export const getReportedReviews = () =>
  API.get("/admin/reviews/reported");
