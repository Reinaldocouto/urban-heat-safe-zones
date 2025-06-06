
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

interface NearestPointResult {
  point: any;
  distance: number;
}

export function findNearestPoint(userLat: number, userLon: number, points: any[]): NearestPointResult {
  if (points.length === 0) {
    throw new Error('No points available');
  }
  
  let nearestPoint = points[0];
  let minDistance = calculateDistance(userLat, userLon, points[0].latitude, points[0].longitude);
  
  for (let i = 1; i < points.length; i++) {
    const distance = calculateDistance(userLat, userLon, points[i].latitude, points[i].longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = points[i];
    }
  }
  
  return {
    point: nearestPoint,
    distance: minDistance
  };
}
