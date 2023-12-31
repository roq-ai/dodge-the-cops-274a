const mapping: Record<string, string> = {
  cars: 'car',
  cops: 'cop',
  games: 'game',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
