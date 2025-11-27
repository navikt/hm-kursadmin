import { useState, useEffect } from 'react';

export const useMobile = (breakpoint: number = 1130): boolean => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);

		return () => window.removeEventListener('resize', checkIsMobile);
	}, [breakpoint]);

	return isMobile;
};
