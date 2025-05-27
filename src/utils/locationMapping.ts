export interface LocationStructure {
  [location: string]: string[];
}

export const locations = [
  'Canada - Quebec',
  'Norway - Enebakk',
  'Norway - Rjukan',
  'United States - Dallas',
  'United States - Houston'
];

export const datahallsByLocation: LocationStructure = {
  'Canada - Quebec': ['Island 1', 'Island 8', 'Island 9', 'Island 10', 'Island 11', 'Island 12', 'Green Nitrogen'],
  'Norway - Enebakk': ['Flying Whale'],
  'Norway - Rjukan': ['Flying Whale'],
  'United States - Dallas': ['Island 1', 'Island 2', 'Island 3', 'Island 4'],
  'United States - Houston': ['H20 Lab']
};