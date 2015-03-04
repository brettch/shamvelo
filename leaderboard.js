'use strict';

var jsonPath = require('JSONPath');
var _ = require('underscore');

// Example leaderboard
//{
//	"year" : [
//		{
//			"year" : 2015
//			"distance" : [
//				{
//					"athleteId" : 1234,
//					"distance" : 2500
//				}
//			]
//		}
//	]
//}

function distanceBuilder(leaderboard) {
}

function buildYearsSet(activities) {
	var reduceFunction = function(yearsSet, activity) {
		// Get the year portion of the activity date.
		var year = new Date(activity.start_date).getFullYear();

		if (!_.contains(yearsSet, year)) {
			yearsSet.push(year);
		}

		return yearsSet;
	};

	return activities.reduce(reduceFunction, []).sort();
}

function buildAthletesSet(activities) {
	var reduceFunction = function(athletesSet, activity) {
		if (!_.contains(athletesSet, activity.athlete.id)) {
			athletesSet.push(activity.athlete.id);
		}

		return athletesSet;
	};

	return activities.reduce(reduceFunction, []).sort();
}

function buildSkeleton(yearsSet, athletesSet) {
	var yearObj = yearsSet.map(function(currentYear) {
		var distance = athletesSet.map(function(currentAthlete) {
			return { athleteId: currentAthlete, distance: 0 };
		});
		return { year: currentYear, distance: distance };
	});

	return { year: yearObj };
}

function buildLeaderboard(activities) {
	// Build the complete set of years.
	var yearsSet = buildYearsSet(activities);
	// Build the complete set of athletes.
	var athletesSet = buildAthletesSet(activities);

	// Build the skeleton leaderboard.
	var leaderboard = buildSkeleton(yearsSet, athletesSet);

	return leaderboard;
}

module.exports.build = buildLeaderboard;

