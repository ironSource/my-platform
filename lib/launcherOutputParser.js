/*
 *	a through2 transformation function that will emit data only after the separator is found in the stream
 */
module.exports = function (separator) {
	separator = separator || '~~launcher~~\n'

	var separatorIndex = -1
	return function (chunk, enc, callback) {

		if (separatorIndex > -1) {
			this.push(chunk)
			return callback()
		}

		if (enc === 'buffer') {
			chunk = chunk.toString()
		} else {
			chunk = chunk.toString(enc)
		}

		//TODO: replace with rabin karp
		separatorIndex = chunk.indexOf(separator)

		if (separatorIndex > -1) {
			this.push(chunk.substring(separatorIndex + separator.length))
		}

		callback()
	}
}

