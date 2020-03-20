/**
 * ColorLib
 * @module colorlib.mjs
 * @version 0.9.10
 * @summary 17-03-2020
 * @author Mads Stoumann
 * @description Color-functions
 */

/**
* brightness
* @param {Number} r
* @param {Number} g
  @param {Number} b
  @description Returns percieved brightness of a color
* @return {Number}
*/
export function brightness(r, g, b) {
	return parseInt(((r*299)+(g*587)+(b*114))/1000, 10);
}

/**
* hex2rgb
* @param {String} hex
* @return {Array}
*/
export function hex2rgb(hex) {
  return hex.match(/[0-9a-f]{2}/gi).map(c => { return parseInt(c, 16) });
}

/**
* rgb2arr
* @param {String} rgb Supports both rgb() and rgba()-syntax
* @return {String}
*/
export function rgb2arr(rgb) {
  const seperator = rgb.includes(',') ? ',' : ' ';
  return rgb.replace(/rgba?\((.*?)\)/, '$1').split(seperator);
}

/**
* rgb2hex
* @param {String} rgb Supports both rgb() and rgba()-syntax
* @return {String}
*/
export function rgb2hex(rgb) {
  return `#${rgb2arr(rgb).map((c, i) => {
    return i < 3 ? parseInt(c, 10).toString(16).padStart(2,'0') : Math.round(parseFloat(c * 255)).toString(16)
  }).join('')}`;
}

/**
* rgb2hsl
* @param {Number} R
* @param {Number} G
  @param {Number} B
* @return {Array}
*/
export function rgb2hsl(R, G, B){
  const r = R/255;
  const g = G/255;
  const	b = B/255;
  const cmin = Math.min(r, g, b);
  const	cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let	h = 0;
  let	s = 0;
  let	l = 0;

  if (delta === 0) {
    h = 0;
  }
  else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  }
  else if (cmax === g) {
    h = (b - r) / delta + 2;
  }
  else {
    h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = + (s * 100).toFixed(1);
  l = + (l * 100).toFixed(1);
  return [h, s, l];
}
