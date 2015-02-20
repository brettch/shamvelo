'use strict';

var assert = require('assert')

// MongoDB database driver.
var mongoClient = require('mongodb').MongoClient

// Util module.
var util = require('./util');


module.exports.start = function(url) {
	// Connect to Mongo DB.
	var mongodb;
	mongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log('Connected to MongoDB');
		mongodb = db;
	});

	// Return accessor methods.
	return {

		// Save or refresh an athlete.
		saveAthlete: function(athlete, callback) {
			// Get the documents collection
			var collection = mongodb.collection('athletes');
			// Add or update the athlete
			collection.update(
				{ id : athlete.id },
				athlete,
				{ upsert : true },
				function(err) {
					if (err) console.log('Unable to insert athlete\n' + util.stringify(err));
					else console.log('Successfully inserted athlete ' + athlete.id);
					callback(err);
				}
			);
		},

		// Save or refresh an athlete's token.
		saveAthleteToken: function(id, token, callback) {
			var collection = mongodb.collection('tokens');
			collection.update(
				{ id: id },
				{ id: id, token: token },
				{ upsert: true },
				function (err) {
					if (err) console.log('Unable to insert token\n' + util.stringify(err));
					else console.log('Successfully inserted token ' + id);
					callback(err);
				}
			);
		},

		// Search for items in the specified collection.
		getItems: function(collection, criteria, callback) {
			console.log('Searching ' + collection + ' with criteria ' + util.stringify(criteria));
			mongodb.collection(collection).find(criteria, {}).toArray(function(err, items) {
				if (err) console.log('Unable to retrieve items\n' + util.stringify(err));
				else console.log('Successfully retrieved items\n' + util.stringify(items));
				callback(err, items);
			});
		}

	}
};

