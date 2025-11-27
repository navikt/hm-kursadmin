import { Theme } from '@navikt/ds-react';
import {
	createContext,
	type PropsWithChildren,
	useEffect,
	useState,
} from 'react';

export const LOCALSTORAGE_KEY_THEME = 'hm-kursadmin-theme';

export const ThemeType = {
	LIGHT: 'light' as const,
	DARK: 'dark' as const,
} as const;

export type ThemeTypeValues = (typeof ThemeType)[keyof typeof ThemeType];

type ThemeContextType = {
	theme: ThemeTypeValues;
	setTheme: (theme: ThemeTypeValues) => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: ThemeType.LIGHT,
	setTheme: () => {},
});

const ThemeProvider = ({ children }: PropsWithChildren) => {
	const localStorageTheme = localStorage.getItem(
		LOCALSTORAGE_KEY_THEME
	) as ThemeTypeValues | null;
	const [theme, setTheme] = useState(localStorageTheme || ThemeType.LIGHT);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<Theme theme={theme}>{children}</Theme>
		</ThemeContext.Provider>
	);
};

export { ThemeContext, ThemeProvider };
