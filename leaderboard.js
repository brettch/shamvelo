'use strict';

var _ = require('underscore');
var jsonPath = require('JSONPath');
var util = require('./util');

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

function calculateYearlyDistance(leaderboard, activities) {
	_.each(activities, function(activity) {
		// Get the year portion of the activity date.
		var year = new Date(activity.start_date).getFullYear();

		var distanceItem = jsonPath.eval(leaderboard, '$.year[?(@.year == ' + year + ')].distance[?(@.athleteId == ' + activity.athlete.id + ')]')[0];
		console.log('distanceItem: ' + util.stringify(distanceItem));
		distanceItem.distance += activity.distance;
	});
}

function buildLeaderboard(activities) {
	// Build the complete set of years.
	var yearsSet = buildYearsSet(activities);
	// Build the complete set of athletes.
	var athletesSet = buildAthletesSet(activities);

	// Build the skeleton leaderboard.
	var leaderboard = buildSkeleton(yearsSet, athletesSet);

	// Calculate yearly athlete distances.
	calculateYearlyDistance(leaderboard, activities);

	return leaderboard;
}

module.exports.build = buildLeaderboard;

