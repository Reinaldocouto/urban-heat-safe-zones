
export function findNearestPoint<T extends { latitude: number; longitude: number }>(
  userLat: number,
  userLon: number,
  pontos: T[]
): { point: T; distance: number } {
  function toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // raio da terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (pontos.length === 0) {
    throw new Error('Nenhum ponto disponível');
  }

  let nearest = pontos[0];
  let minDist = calculateDistance(userLat, userLon, nearest.latitude, nearest.longitude);

  pontos.forEach((p) => {
    const dist = calculateDistance(userLat, userLon, p.latitude, p.longitude);
    if (dist < minDist) {
      minDist = dist;
      nearest = p;
    }
  });

  return { point: nearest, distance: minDist };
}
