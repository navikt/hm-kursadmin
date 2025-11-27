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
	const getInitialTheme = (): ThemeTypeValues => {
		const savedTheme = localStorage.getItem(LOCALSTORAGE_KEY_THEME);

		if (
			savedTheme &&
			Object.values(ThemeType).includes(savedTheme as ThemeTypeValues)
		) {
			return savedTheme as ThemeTypeValues;
		}

		if (typeof window !== 'undefined' && window.matchMedia) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
				? ThemeType.DARK
				: ThemeType.LIGHT;
		}
		return ThemeType.LIGHT;
	};

	const [theme, setThemeState] = useState<ThemeTypeValues>(getInitialTheme);

	const setTheme = (newTheme: ThemeTypeValues) => {
		setThemeState(newTheme);
		localStorage.setItem(LOCALSTORAGE_KEY_THEME, newTheme);
	};

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
