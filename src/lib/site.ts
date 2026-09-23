export const company = {
  name: 'SRI SUBHAM (M) SDN. BHD',
  email: 'Srisubham3359@gmail.com',
  phone: '+60 124323359',
  phoneHref: 'tel:+60124323359',
};

export const branches = [
  {
    name: 'Main HQ · Perai',
    lines: ['No. 2938, 2939, 2940 & 2941, Jalan Perai', 'Taman Inderawasih', '13600 Perai, Pulau Pinang'],
  },
  {
    name: 'Butterworth',
    lines: ['No. 3739–3740, Jalan Telaga Air', 'Butterworth, Pulau Pinang'],
  },
  {
    name: 'Nibong Tebal',
    lines: ['No. 3362–3363, Jalan Nuri', 'Taman Sentosa', '14300 Nibong Tebal, Pulau Pinang'],
  },
  {
    name: 'Penang',
    lines: ['No. 20, 22, 24 & 26, Ground, First & Second Floor', 'Lebuh Chulia', '10200 Pulau Pinang'],
  },
];

export function mapsUrl(lines: string[]) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(', '))}`;
}

export const galleryGroups = [
  { title: 'Perai', folder: 'perai' },
  { title: 'Butterworth', folder: 'butterworth' },
  { title: 'Nibong Tebal', folder: 'nibong-tebal' },
  { title: 'Penang', folder: 'penang' },
  { title: 'Padang Serai', folder: 'padang-serai' },
  { title: 'Warehouse', folder: 'warehouse' },
];
