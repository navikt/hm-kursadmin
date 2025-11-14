import type { Person } from '../mocks/handlers/personer';

export const hentPersoner = async (): Promise<Person[]> => {
	const response = await fetch('/api/personer');

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};
