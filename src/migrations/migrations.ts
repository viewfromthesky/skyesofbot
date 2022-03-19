export interface Migration {
	name: string;
	up: string;
	down?: string;
}

export const migrations: Record<string, Migration> = {
	"084ca402-c31e-44a2-8d7c-f862ff8c885c": {
		"name": "Create bookmarks",
		"up": "create-bookmarks"
	}
};
