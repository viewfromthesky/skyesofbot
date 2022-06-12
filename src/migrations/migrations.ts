export interface Migration {
  name: string;
  up: string;
  down?: string;
}

export const migrations: Record<string, Migration> = {
  '084ca402-c31e-44a2-8d7c-f862ff8c885c': {
    name: 'Create bookmarks',
    up: 'create-bookmarks'
  },
  // '77526105-7aea-41f3-8d72-0eaa3753cb69': {
  //   name: 'Create snippets',
  //   up: 'create-snippets'
  // }
  '92eabb60-fcf9-4782-98c3-5331423bf8ab': {
    name: 'Create quotes',
    up: 'create-quotes'
  },
  'ed56d8fa-c0ef-45b5-8f02-a9c3ecc4ba12': {
    name: 'Add quote_year',
    up: 'update-quote-year'
  },
  '4dad0014-4a2d-4284-afae-84165686542b': {
    name: 'Create temporary voice channels',
    up: 'create-temporary-voice-channels'
  }
};
