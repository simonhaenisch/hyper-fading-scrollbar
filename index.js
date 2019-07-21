const colorString = require('color-string');

const SCROLLBAR_ACTIVE_CLASS = 'scrollbar-active';

// --
// Change scrollbar color to a dim version.
// Add a toggleable 'active' class to the scrollbar.

const getColor = config => config.scrollbarColor || config.borderColor || 'gray';
const getOpacity = config => (typeof config.scrollbarOpacity === 'number' ? config.scrollbarOpacity : 0.3);

exports.getColor = getColor;
exports.getOpacity = getOpacity;

exports.decorateConfig = config => {
	const color = getColor(config);
	const dimBase = colorString.get.rgb(color);
	const opacity = getOpacity(config);
	const dimColor = [dimBase[0], dimBase[1], dimBase[2], opacity];

	return Object.assign({}, config, {
		css: `
			${config.css || ''}

			.xterm-viewport::-webkit-scrollbar-thumb {
				background-color: ${colorString.to.rgb(dimColor)};
			}

			.xterm-viewport::-webkit-scrollbar-thumb:hover,
			.xterm-viewport.${SCROLLBAR_ACTIVE_CLASS}::-webkit-scrollbar-thumb {
				background-color: ${color};
			}
		`,
	});
};

// --
// Add a scroll event handler to each term's viewport.

exports.decorateTerm = (Term, { React }) => {
	return class extends React.Component {
		constructor(props, context) {
			super(props, context);

			this.terms = null;
			this.viewport = null;
			this.timer = null;

			this.onDecorated = this.onDecorated.bind(this);
			this.scrollHandler = this.scrollHandler.bind(this);
		}

		onDecorated(terms) {
			if (this.props.onDecorated) {
				this.props.onDecorated(terms); // propagate to HOC chain
			}

			if (!terms) {
				return;
			}

			this.terms = terms;

			const viewport = this.terms.term.element.querySelector('.xterm-viewport');

			if (!viewport) {
				return console.warn("hyper-fading-scrollbar: could not find xterm viewport, can't attach scroll handler.");
			}

			this.viewport = viewport;
			this.viewport.addEventListener('scroll', this.scrollHandler);
		}

		scrollHandler(event) {
			const terminal = this.terms.term;
			const scrolledToEnd = terminal._core.buffer.ybase === terminal._core.buffer.ydisp;

			if (scrolledToEnd) {
				return;
			}

			clearTimeout(this.timer);

			this.viewport.classList.add(SCROLLBAR_ACTIVE_CLASS);

			this.timer = setTimeout(() => this.viewport.classList.remove(SCROLLBAR_ACTIVE_CLASS), 300);
		}

		componentWillUnmount() {
			if (this.viewport) {
				this.viewport.removeEventListener('scroll', this.scrollHandler);
			}
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, { onDecorated: this.onDecorated }));
		}
	};
};
