export type FreeToolId = 'smart-hiit';

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
];
