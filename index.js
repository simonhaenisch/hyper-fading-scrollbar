const colorString = require('color-string');

const SCROLLBAR_ACTIVE_CLASS = 'scrollbar-active';

// --
// Change scrollbar color to a dim version.
// Add a toggleable 'active' class to the scrollbar.

exports.decorateConfig = config => {
	const color = config.scrollbarColor || config.borderColor || 'gray';
	const dimBase = colorString.get.rgb(color);
	const dim = [dimBase[0], dimBase[1], dimBase[2], 0.3];

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
// Add a scroll event handler to each term's viewport.

exports.decorateTerm = (Term, { React }) => {
	return class extends React.Component {
		constructor(props, context) {
			super(props, context);
			this.term = null;
			this.scrollHandler = null;
			this.timer = null;
			this.onDecorated = this.onDecorated.bind(this);
		}

		getScrollHandler() {
			return event => {
				const terminal = this.term.term;
				const scrolledToEnd = terminal.buffer.ybase === terminal.buffer.ydisp;

				if (!scrolledToEnd) {
					clearTimeout(this.timer);
					terminal._viewportElement.classList.add(SCROLLBAR_ACTIVE_CLASS);
					this.timer = setTimeout(() => {
						terminal._viewportElement.classList.remove(SCROLLBAR_ACTIVE_CLASS);
					}, 300);
				}
			};
		}

		onDecorated(term) {
			this.term = term;
			if (this.props.onDecorated) {
				// propagate to HOC chain
				this.props.onDecorated(term);
			}

			if (this.term) {
				if (this.term.term._viewportElement) {
					this.scrollHandler = this.getScrollHandler();
					this.term.term._viewportElement.addEventListener('scroll', this.scrollHandler);
				} else {
					console.warn("hyper-fading-scrollbar: could not access _viewportElement, can't attach scroll handler.");
				}
			}
		}

		componentWillUnmount() {
			if (this.term.term._viewportElement) {
				this.term.term._viewportElement.removeEventListener('scroll', this.scrollHandler);
			}
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, { onDecorated: this.onDecorated }));
		}
	};
};
