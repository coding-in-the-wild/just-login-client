function createSession(api, emitter, cb) { //cb(err, api, session)
	var existing = localStorage.getItem("justLoginSessionId")
	api.continueExistingSession(existing, function (err, fullApi, sessionId) {
		if (err) { //bad session id attempt
			api.createNewSession(function (err, fullApi, sessionId) {
				if (err) {
					cb(err)
				} else {
					localStorage.setItem("justLoginSessionId", sessionId)
					process.nextTick(function() {
						emitter.emit('new session', sessionId)
					})

					var timer = setInterval(function() {
						fullApi.isAuthenticated(function(err, name) {
							if (!err && name) {
								emitter.emit('authenticated', true)
								clearInterval(timer)
							}
						})
					}, 2000)

					cb(null, fullApi, sessionId)
				}
			})
		} else {
			process.nextTick(function() {
				emitter.emit('continue session', sessionId)
			})
			cb(null, fullApi, sessionId)
		}
	})
}

module.exports = createSession
