import React from 'react';
import SVGS from '../assets/all.svg';

const SVG = (props) => {
	return (
		<svg className={props.className}>
			<use xlinkHref={`${SVGS}#icon-${props.name}`}></use>
		</svg>
	);
};

export default SVG;
