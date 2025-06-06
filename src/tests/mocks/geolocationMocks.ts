
export const mockPosition = {
  coords: {
    latitude: -23.5505,
    longitude: -46.6333,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

export const mockGeolocationSuccess = () => {
  (global.navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
    (success) => success(mockPosition)
  );
};

export const mockGeolocationError = () => {
  (global.navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
    (_, error) => error({ code: 1, message: 'Permission denied' })
  );
};
