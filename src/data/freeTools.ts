export type FreeToolId = 'smart-hiit' | 'tipo-cambio';

export type FreeTool = {
  id: FreeToolId;
  url: string;
  image: string;
};

/** Free-to-use CastleXpert apps (external PWAs). Not sales demos. */
export const freeTools: FreeTool[] = [
  {
    id: 'smart-hiit',
    url: 'https://smarthiit.castlexpert.com/',
    image: '/images/tools/smart-hiit-card.png',
  },
  {
    id: 'tipo-cambio',
    url: 'https://tipocambio.castlexpert.com/',
    image: '/images/tools/tipo-cambio-card.png',
  },
];
