// src/utils/location.js

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by this browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "Error getting user location";

        switch (error.code) {
          case 1:
            message = "Permission denied. Allow location access.";
            break;
          case 2:
            message = "Location unavailable. Check your device's GPS.";
            break;
          case 3:
            message = "Request timed out. Try again.";
            break;
        }

        console.error(message, error);
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false, // Changed (more stable)
        timeout: 10000, // Increased timeout (10s)
        maximumAge: 0,
      }
    );
  });
};
