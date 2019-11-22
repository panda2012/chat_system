(function(exports) {
	// Event type
	exports.EVENT_TYPE = {
		'LOGIN': 'LOGIN',
		'LOGOUT': 'LOGOUT',
		'SPEAK': 'SPEAK',
		'LIST_USER': 'LIST_USER',
		'ERROR': 'ERROR',
		'LIST_HISTORY': 'LIST_HISTORY'
	};

	
	// server port
	exports.HOST = "127.0.0.1";

	var analyzeMessageData = exports.analyzeMessageData = function(message) {
			try {
				return JSON.parse(message);
			} catch(error) {
				//receive invalid formation data
				console.log('method:analyzeMsgData,error:' + error);
			}

			return null;
		}

	var getMsgFirstDataValue = exports.getMsgFirstDataValue = function(mData) {
			if(mData && mData.values && mData.values[0]) {
				return mData.values[0];
			}

			return '';
		}

	var getMsgsSecondDataValue = exports.getMsgSecondDataValue = function(mData) {
			if(mData && mData.values && mData.values[1]) {
				return mData.values[1];
			}

			return '';
		}

})((function() {
	if(typeof exports === 'undefined') {
		window.chatLib = {};
		return window.chatLib;
	} else {
		return exports;
	}
})());
