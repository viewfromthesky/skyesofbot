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
  }
};
