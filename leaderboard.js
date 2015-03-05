'use strict';

var _ = require('underscore');
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
			},
			"monthlyWins" : [
				{
					"athleteId" : 1234,
					"wins" : 1
				}
			],
			"monthlyWinsByAthleteId" : {
				"1234" : {
					"athleteId" : 1234,
					"wins" : 1
				}
			},
			"weeklyWins" : [
				{
					"athleteId" : 1234,
					"wins" : 1
				}
			],
			"weeklyWinsByAthleteId" : {
				"1234" : {
					"athleteId" : 1234,
					"wins" : 1
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

// Get the year portion of the date as an integer.
function yearFromDate(date) {
	return date.getFullYear();
}

// Get the unique list of years present in the list of activities.
function buildYearsSet(activities) {
	return buildDateSet(activities, yearFromDate);
}

// Get the month of the date as an integer in format yyyymm.
function monthFromDate(date) {
	return date.getFullYear() * 100 + (date.getMonth() + 1);
}

// Get the year portion of an integer date in format yyyymm.
function yearFromMonth(month) {
	return Math.floor(month / 100);
}

// Get the unique list of months present in the list of activities.
function buildMonthsSet(activities) {
	return buildDateSet(activities, monthFromDate);
}

// Get the week of the date as an integer in format yyyyww.
function weekFromDate(date) {
	// Clone the date so that we don't affect the provided date
    var tmpDate = new Date(+date);
    // Zero out time portion of the date.
    tmpDate.setHours(0, 0, 0);
    // Set the date to the nearest Thursday: current date + 4 - current day number
    // Make Sunday day 7 instead of 0.
    tmpDate.setDate(tmpDate.getDate() + 4 - (tmpDate.getDay() || 7));
    // Get the first day of the same year.
    var yearStart = new Date(tmpDate.getFullYear(),0,1);
    // Calculate the number of weeks between the start of the year and the nearest Thursday.
    var week = Math.ceil(( ( (tmpDate - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    // Return integer in format yyyyww.
    return tmpDate.getFullYear() * 100 + week;
}

// Get the year portion of an integer date in format yyyyww.
function yearFromWeek(week) {
	return Math.floor(week / 100);
}

// Get the unique list of weeks present in the list of activities.
function buildWeeksSet(activities) {
	return buildDateSet(activities, weekFromDate);
}

// Get the unique set of athlete ids.
function buildAthletesSet(activities) {
	var reduceFunction = function(athletesSet, activity) {
		if (!_.contains(athletesSet, activity.athlete.id)) {
			athletesSet.push(activity.athlete.id);
		}

		return athletesSet;
	};

	return activities.reduce(reduceFunction, []).sort();
}

// For each athlete create a distance object with athlete id and distance.
// Return a tuple containing a list of these objects, and a map keyed by athlete id.
function buildAthletesDistanceSet(athletesSet) {
	var reduceDistanceById = function(distanceByAthleteId, distanceRecord) {
		distanceByAthleteId[distanceRecord.athleteId] = distanceRecord;
		return distanceByAthleteId;
	};

	// Build an array of athlete distance objects.
	var distance = athletesSet.map(function(currentAthlete) {
		return { athleteId: currentAthlete, distance: 0 };
	});
	// Create an index of athlete distance objects by athlete id.
	var distanceByAthleteId = distance.reduce(reduceDistanceById, {});

	return [distance, distanceByAthleteId];
}

function buildAthletesWinsSet(athletesSet) {
	var reduceById = function(winsByAthleteId, winsRecord) {
		winsByAthleteId[winsRecord.athleteId] = winsRecord;
		return winsByAthleteId;
	};

	// Build an array of athlete win objects.
	var wins = athletesSet.map(function(currentAthlete) {
		return { athleteId: currentAthlete, wins: 0 };
	});
	// Create an index of athlete wins objects by athlete id.
	var winsByAthleteId = wins.reduce(reduceById, {});

	return [wins, winsByAthleteId];
}

function buildSkeleton(yearsSet, monthsSet, weeksSet, athletesSet) {
	// Build an array of year objects sorted by reverse chronological time.
	var yearObj = yearsSet.map(function(currentYear) {
		// Build athlete distance objects.
		var distanceTuple = buildAthletesDistanceSet(athletesSet);
		var distance = distanceTuple[0];
		var distanceByAthleteId = distanceTuple[1];

		// Build monthly and weekly win totals objects.
		var monthlyWinsTuple = buildAthletesWinsSet(athletesSet);
		var weeklyWinsTuple = buildAthletesWinsSet(athletesSet);

		return {
			year: currentYear,
			distance: distance,
			distanceByAthleteId: distanceByAthleteId,
			month: [],
			week: [],
			monthlyWins: monthlyWinsTuple[0],
			monthlyWinsByAthleteId: monthlyWinsTuple[1],
			weeklyWins: weeklyWinsTuple[0],
			weeklyWinsByAthleteId: weeklyWinsTuple[1]
		};
	}).sort(function(a, b) {
		return b.year - a.year;
	});
	// Create an index of year objects by year id.
	var yearById = yearObj.reduce(function(yearById, yearRecord) {
		yearById[yearRecord.year] = yearRecord;
		return yearById;
	}, {});

	// Build arrays of month objects grouped by year and sorted by reverse chronological time.
	monthsSet.forEach(function(currentMonth) {
		// Build athlete distance objects.
		var distanceTuple = buildAthletesDistanceSet(athletesSet);
		var distance = distanceTuple[0];
		var distanceByAthleteId = distanceTuple[1];

		// Add the month to the relevant year.
		var monthObj = { month: currentMonth, distance: distance, distanceByAthleteId: distanceByAthleteId };
		yearById[yearFromMonth(currentMonth)].month.push(monthObj);
	});
	// Sort the month records by reverse chronological time, and create indexes of month objects by month id within each year.
	yearObj.forEach(function(yearRecord) {
		yearRecord.month.sort(function(a, b) {
			return b.month - a.month;
		});
		yearRecord.monthById = yearRecord.month.reduce(function(monthById, monthRecord) {
			monthById[monthRecord.month] = monthRecord;
			return monthById;
		}, {});
	});

	// Build arrays of week objects grouped by year and sorted by reverse chronological time.
	weeksSet.forEach(function(currentWeek) {
		// Build athlete distance objects.
		var distanceTuple = buildAthletesDistanceSet(athletesSet);
		var distance = distanceTuple[0];
		var distanceByAthleteId = distanceTuple[1];

		// Add the week to the relevant year.
		var weekObj = { week: currentWeek, distance: distance, distanceByAthleteId: distanceByAthleteId };
		yearById[yearFromWeek(currentWeek)].week.push(weekObj);
	});
	// Sort the week records by reverse chronological time, and create indexes of week objects by week id within each year.
	yearObj.forEach(function(yearRecord) {
		yearRecord.week.sort(function(a, b) {
			return b.week - a.week;
		});
		yearRecord.weekById = yearRecord.week.reduce(function(weekById, weekRecord) {
			weekById[weekRecord.week] = weekRecord;
			return weekById;
		}, {});
	});

	return { year: yearObj, yearById: yearById };
}

function calculateDistance(leaderboard, activities) {
	activities.forEach(function(activity) {
		// Get the year and month portions of the activity date.
		var date = new Date(activity.start_date);
		var year = yearFromDate(date);
		var month = monthFromDate(date);
		var monthYear = yearFromMonth(month);
		var week = weekFromDate(date);
		var weekYear = yearFromWeek(week);

		// Get all the distance records that the activity fits into.
		var distanceItems = [
			// yearly record
			leaderboard.yearById[year].distanceByAthleteId[activity.athlete.id],
			// monthly record
			leaderboard.yearById[monthYear].monthById[month].distanceByAthleteId[activity.athlete.id],
			// weekly record
			leaderboard.yearById[weekYear].weekById[week].distanceByAthleteId[activity.athlete.id]
		];
		distanceItems.forEach(function (distanceItem) {
			distanceItem.distance += activity.distance;
		});
	});
	// Sort distances in descending order.
	leaderboard.year.forEach(function(year) {
		year.distance.sort(function(a, b) {
			return b.distance - a.distance;
		});
	});
}

function calculateWins(leaderboard) {
	leaderboard.year.forEach(function(yearObj) {
		yearObj.month.forEach(function(monthObj) {
			var athleteId = monthObj.distance[0].athleteId;
			yearObj.monthlyWinsByAthleteId[athleteId].wins += 1;
		});
		yearObj.monthlyWins.sort(function(a, b) {
			return b.wins - a.wins;
		});
		yearObj.week.forEach(function(weekObj) {
			var athleteId = weekObj.distance[0].athleteId;
			yearObj.weeklyWinsByAthleteId[athleteId].wins += 1;
		});
		yearObj.weeklyWins.sort(function(a, b) {
			return b.wins - a.wins;
		});
	});
}

function buildLeaderboard(activities) {
	// Build the complete set of years.
	var yearsSet = buildYearsSet(activities);
	// Build the complete set of months.
	var monthsSet = buildMonthsSet(activities);
	// Build the complete set of weeks.
	var weeksSet = buildWeeksSet(activities);
	// Build the complete set of athletes.
	var athletesSet = buildAthletesSet(activities);

	// Build the skeleton leaderboard.
	var leaderboard = buildSkeleton(yearsSet, monthsSet, weeksSet, athletesSet);

	// Calculate athlete distances.
	calculateDistance(leaderboard, activities);

	// Calculate total wins.
	calculateWins(leaderboard);

	console.log("leaderboard: " + util.stringify(leaderboard));

	return leaderboard;
}

module.exports.build = buildLeaderboard;
