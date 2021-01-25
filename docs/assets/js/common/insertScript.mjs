/**
 * @function insertScript
 * @param {String} src
 * @param {Boolean} [async]
 * @description Adds script-block
 */
export function insertScript(src, async = true) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.async = async;
		script.onload = script.onreadystate = () => { resolve(src); }
		script.onerror = (err) => { reject(err)};
		document.head.appendChild(script);
	})
}