'use strict';

function getVariable(envVar, defaultValue) {
	if (process.env[envVar])
		return process.env[envVar];
	else
		return defaultValue;
}

module.exports.express = {
	port : getVariable('SHAMVELO_EXPRESS_PORT', 8080)
};
module.exports.mongo = {
	url : getVariable('SHAMVELO_MONGO_URL', 'mongodb://localhost:27017/shamvelo')
};

