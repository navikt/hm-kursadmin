import { ThemeIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

import { ThemeType } from '../contexts/ThemeContext';
import { useThemeContext } from '../hooks/useThemeContext';

const ThemeSwitcher = () => {
	const { theme, setTheme } = useThemeContext();

	return (
		<Tooltip
			content={
				theme === ThemeType.DARK
					? 'Endre til lyst tema'
					: 'Endre til mørkt tema'
			}
		>
			<Button
				variant="tertiary"
				size="small"
				icon={<ThemeIcon aria-label="Tema ikon" />}
				aria-label={
					theme === ThemeType.DARK
						? 'Endre til lyst tema'
						: 'Endre til mørkt tema'
				}
				onClick={() => {
					const valgtTema =
						theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK;
					setTheme(valgtTema);
				}}
			/>
		</Tooltip>
	);
};

export default ThemeSwitcher;
