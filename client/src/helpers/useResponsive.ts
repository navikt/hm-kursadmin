import { useState, useEffect } from 'react';

const useBreakpoint = (breakpoint: number): boolean => {
	const [isBelow, setIsBelow] = useState(false);

	useEffect(() => {
		const check = () => {
			setIsBelow(window.innerWidth < breakpoint);
		};

		check();
		window.addEventListener('resize', check);

		return () => window.removeEventListener('resize', check);
	}, [breakpoint]);

	return isBelow;
};

export const useMobile = (breakpoint: number = 900): boolean => {
	return useBreakpoint(breakpoint);
};

export const useTablet = (breakpoint: number = 768): boolean => {
	return useBreakpoint(breakpoint);
};
