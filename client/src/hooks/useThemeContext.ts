import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext må være i scope av: ThemeProvider');
	}

	return context;
};
