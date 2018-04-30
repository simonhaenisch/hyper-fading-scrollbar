const colorString = require('color-string');

const SCROLLBAR_ACTIVE_CLASS = 'scrollbar-active';

// --
// Change scrollbar color to a dim version.
// Add a toggleable 'active' class to the scrollbar.

exports.decorateConfig = config => {
	const color = config.scrollbarColor || config.borderColor || 'white';
	const dimBase = colorString.get.rgb(color);
	const dim = [dimBase[0], dimBase[1], dimBase[2], 0.1];

	return Object.assign({}, config, {
		css: `
			${config.css || ''}

			.xterm-viewport::-webkit-scrollbar-thumb {
				background-color: ${colorString.to.rgb(dim)};
			}

			.xterm-viewport::-webkit-scrollbar-thumb:hover,
			.xterm-viewport.${SCROLLBAR_ACTIVE_CLASS}::-webkit-scrollbar-thumb {
				background-color: ${color};
			}
		`,
	});
};

// --
// Add a scroll event to each term viewport.

const timers = {};

exports.getTermProps = (uid, parentProps, props) => {
	if (props.term && uid) {
		const viewport = props.term.viewport._viewportElement;
		const scrollArea = props.term.viewport._scrollArea;

		if (!viewport.onscroll) {
			viewport.onscroll = event => {
				const offsetBottom = viewport.scrollTop + parseInt(window.getComputedStyle(viewport).height);
				const scrolledToTop = offsetBottom === scrollArea.scrollHeight;

				if (!scrolledToTop) {
					clearTimeout(timers[uid]);
					viewport.classList.add(SCROLLBAR_ACTIVE_CLASS);
					timers[uid] = setTimeout(() => {
						viewport.classList.remove(SCROLLBAR_ACTIVE_CLASS);
					}, 300);
				}
			};
		}
	}

	return props;
};
