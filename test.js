const test = require('tape');
const { getColor, getOpacity, decorateConfig } = require('./index');

test('fallback scrollbar color should be gray', t => {
	const color = getColor({});
	t.plan(1);
	t.equal(color, 'gray');
});

test('scrollbar color should be set by border color', t => {
	const color = getColor({ borderColor: '#abc' });
	t.plan(1);
	t.equal(color, '#abc');
});

test('scrollbarColor should be able to overwrite borderColor', t => {
	const color = getColor({ borderColor: '#abc', scrollbarColor: '#def' });
	t.plan(1);
	t.equal(color, '#def');
});

test('default opacity should be 0.3', t => {
	const opacity = getOpacity({});
	t.plan(1);
	t.equal(opacity, 0.3);
});

test('setting scrollbarOpacity should be applied', t => {
	const opacity = getOpacity({ scrollbarOpacity: 0.5 });
	t.plan(1);
	t.equal(opacity, 0.5);
});

test('decorateConfig should add a css field to the config', t => {
	const config = decorateConfig({});
	t.plan(1);
	t.ok(config.css);
});

test('decorateConfig should extend existing css value', t => {
	const css = '.class { color: #abc; }';
	const config = decorateConfig({ css });
	t.plan(1);
	t.ok(config.css.trim().startsWith(css));
});
