'use strict';

var _ = require('underscore');
var jsonPath = require('JSONPath');
var util = require('./util');

// Example leaderboard
var exampleLeaderboard = {
	"year" : [
		{
			"year" : 2015,
			"distance" : [
				{
					"athleteId" : 1234,
					"distance" : 2500
				}
			],
			"distanceByAthleteId" : {
				"1234" : {
					"athleteId" : 1234,
					"distance" : 2500
				}
			}
		}
	],
	"yearById" : {
		"2015" : {
			"year" : 2015,
			"distance" : [
				{
					"athleteId" : 1234,
					"distance" : 2500
				}
			],
			"distanceByAthleteId" : {
				"1234" : {
					"athleteId" : 1234,
					"distance" : 2500
				}
			}
		}
	}
}

function buildDateSet(activities, dateMapper) {
	var reduceFunction = function(resultSet, activity) {
		// Reduce the date to an integer of reduced granularity.
		var item = dateMapper(new Date(activity.start_date));

		if (!_.contains(resultSet, item)) {
			resultSet.push(item);
		}

		return resultSet;
	};

	return activities.reduce(reduceFunction, []);
}

function yearFromDate(date) {
	return date.getFullYear();
}

function buildYearsSet(activities) {
	return buildDateSet(activities, yearFromDate);
}

function monthFromDate(date) {
	return date.getFullYear() * 100 + date.getMonth();
}

function buildMonthsSet(activities) {
	return buildDateSet(activities, monthFromDate);
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
	var reduceDistanceById = function(distanceByAthleteId, distanceRecord) {
		distanceByAthleteId[distanceRecord.athleteId] = distanceRecord;
		return distanceByAthleteId;
	};

	// Build an array of year objects sorted by reverse chronological time.
	var yearObj = yearsSet.map(function(currentYear) {
		// Build an array of athlete distance objects.
		var distance = athletesSet.map(function(currentAthlete) {
			return { athleteId: currentAthlete, distance: 0 };
		});
		// Create an index of athlete distance objects by athlete id.
		var distanceByAthleteId = distance.reduce(reduceDistanceById, {});

		return { year: currentYear, distance: distance, distanceByAthleteId: distanceByAthleteId };
	}).sort(function(a, b) {
		return a.year < b.year;
	});
	// Create an index of year objects by year id.
	var yearById = yearObj.reduce(function(yearById, yearRecord) {
		yearById[yearRecord.year] = yearRecord;
		return yearById;
	}, {});

	return { year: yearObj, yearById: yearById };
}

function calculateYearlyDistance(leaderboard, activities) {
	_.each(activities, function(activity) {
		// Get the year portion of the activity date.
		var year = yearFromDate(new Date(activity.start_date));

		var distanceItem = leaderboard.yearById[year].distanceByAthleteId[activity.athlete.id];
		distanceItem.distance += activity.distance;
	});
	// Sort distances in descending order.
	leaderboard.year.forEach(function(year) {
		year.distance.sort(function(a, b) {
			return a.distance < b.distance;
		});
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

	console.log("leaderboard: " + util.stringify(leaderboard));

	return leaderboard;
}

module.exports.build = buildLeaderboard;

