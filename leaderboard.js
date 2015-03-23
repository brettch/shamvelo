'use strict';

var _ = require('underscore');
var util = require('./util');

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

// Create a map of athletes keyed by their id.
function buildAthletesById(athletes) {
	return athletes.reduce(function(athletesById, athlete) {
		athletesById[athlete.id] = athlete;
		return athletesById;
	}, {});
}

function buildAthleteName(athlete) {
	return athlete.firstname + ' ' + athlete.lastname;
}

// For each athlete create a summary object with athlete details and distance.
// Return a tuple containing a list of these objects, and a map keyed by athlete id.
function buildAthleteSummaries(athletes) {
	var reduceSummaryById = function(summaryByAthleteId, summaryRecord) {
		summaryByAthleteId[summaryRecord.athleteId] = summaryRecord;
		return summaryByAthleteId;
	};

	// Build an array of athlete summary objects.
	var summary = athletes.map(function(athlete) {
		return {
			athleteId: athlete.id,
			athleteName: buildAthleteName(athlete),
			distance: 0,
			movingTime: 0,
			activityCount: 0
		};
	});
	// Create an index of athlete distance objects by athlete id.
	var summaryByAthleteId = summary.reduce(reduceSummaryById, {});

	return [summary, summaryByAthleteId];
}

function buildAthletesWins(athletes) {
	var reduceById = function(winsByAthleteId, winsRecord) {
		winsByAthleteId[winsRecord.athleteId] = winsRecord;
		return winsByAthleteId;
	};

	// Build an array of athlete win objects.
	var wins = athletes.map(function(athlete) {
		return {
			athleteId: athlete.id,
			athleteName: athlete.firstname + ' ' + athlete.lastname,
			wins: 0
		};
	});
	// Create an index of athlete wins objects by athlete id.
	var winsByAthleteId = wins.reduce(reduceById, {});

	return [wins, winsByAthleteId];
}

function buildSkeleton(yearsSet, monthsSet, weeksSet, athletes) {
	// Build an array of year objects sorted by reverse chronological time.
	var yearObj = yearsSet.map(function(currentYear) {
		// Build athlete summary objects.
		var summariesTuple = buildAthleteSummaries(athletes);
		var summaries = summariesTuple[0];
		var summariesByAthleteId = summariesTuple[1];

		// Build monthly and weekly win totals objects.
		var monthlyWinsTuple = buildAthletesWins(athletes);
		var weeklyWinsTuple = buildAthletesWins(athletes);

		return {
			year: currentYear,
			distance: summaries,
			averageSpeed: summaries.slice(),
			activityCount: summaries.slice(),
			summaryByAthleteId: summariesByAthleteId,
			month: [],
			week: [],
			monthlyWins: monthlyWinsTuple[0],
			monthlyWinsByAthleteId: monthlyWinsTuple[1],
			weeklyWins: weeklyWinsTuple[0],
			weeklyWinsByAthleteId: weeklyWinsTuple[1],
			longestRide: {},
			fastestRide: {}
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
		// Build athlete summary objects.
		var summariesTuple = buildAthleteSummaries(athletes);
		var summaries = summariesTuple[0];
		var summariesByAthleteId = summariesTuple[1];

		// Add the month to the relevant year.
		var monthObj = {
			month: currentMonth,
			distance: summaries,
			averageSpeed: summaries.slice(),
			activityCount: summaries.slice(),
			summaryByAthleteId: summariesByAthleteId
		};
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
		// Build athlete summary objects.
		var summariesTuple = buildAthleteSummaries(athletes);
		var summaries = summariesTuple[0];
		var summariesByAthleteId = summariesTuple[1];

		// Add the week to the relevant year.
		var weekObj = {
			week: currentWeek,
			distance: summaries,
			averageSpeed: summaries.slice(),
			activityCount: summaries.slice(),
			summaryByAthleteId: summariesByAthleteId
		};
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

function calculateSummary(leaderboard, activities) {
	activities.forEach(function(activity) {
		// Get the year and month portions of the activity date.
		var date = new Date(activity.start_date);
		var year = yearFromDate(date);
		var month = monthFromDate(date);
		var monthYear = yearFromMonth(month);
		var week = weekFromDate(date);
		var weekYear = yearFromWeek(week);

		// Get all the distance records that the activity fits into.
		var summaryItems = [
			// yearly record
			leaderboard.yearById[year].summaryByAthleteId[activity.athlete.id],
			// monthly record
			leaderboard.yearById[monthYear].monthById[month].summaryByAthleteId[activity.athlete.id],
			// weekly record
			leaderboard.yearById[weekYear].weekById[week].summaryByAthleteId[activity.athlete.id]
		];
		summaryItems.forEach(function (summaryItem) {
			summaryItem.distance = Math.round(summaryItem.distance * 10 + activity.distance / 100) / 10;
			summaryItem.movingTime += activity.moving_time;
			summaryItem.rides++;

			// The average speed on the activity object is incorrect (unsure why), so calculate it.
			// This could be done after processing all activities, but it's a relatively simple calculation.
			if (summaryItem.distance > 0)
				summaryItem.averageSpeed = Math.round(summaryItem.distance / summaryItem.movingTime * 3600 * 10) / 10;
			else
				summaryItem.averageSpeed = 0;
		});
	});

	function descendingComparator(fieldReader) {
		return function(a, b) {
			return fieldReader(b) - fieldReader(a);
		}
	}

	function timeIntervalSorter(interval) {
		interval.distance.sort(descendingComparator(function(item) { return item.distance }));
		interval.averageSpeed.sort(descendingComparator(function(item) { return item.averageSpeed }));
		interval.activityCount.sort(descendingComparator(function(item) { return item.activityCount }));
	}

	// Sort distances, average speeds, and rides in descending order.
	leaderboard.year.forEach(function(year) {
		timeIntervalSorter(year);
		year.month.forEach(function(month) {
			timeIntervalSorter(month);
		});
		year.week.forEach(function(week) {
			timeIntervalSorter(week);
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

function calculateLongestRide(leaderboard, activities, athletesById) {
	activities.forEach(function(activity) {
		var date = new Date(activity.start_date);
		var year = yearFromDate(date);
		var longestRideObj = leaderboard.yearById[year].longestRide;

		var updateLongestRide = function() {
			longestRideObj.activity = activity;
			longestRideObj.athleteId = activity.athlete.id;
			longestRideObj.athleteName = buildAthleteName(athletesById[activity.athlete.id]);
		}

		// If this activity is longer than the current longest activity, then replace
		// the existing one.
		if (longestRideObj.activity) {
			if (longestRideObj.activity.distance < activity.distance)
				updateLongestRide();
		} else {
			updateLongestRide();
		}
	});
}

function calculateActivitySpeed(activity) {
	if (activity.distance > 0)
		return Math.round(activity.distance / activity.moving_time * 3.600 * 10) / 10;
	else
		return 0;
}

function calculateFastestRide(leaderboard, activities, athletesById) {
	activities.forEach(function(activity) {
		var date = new Date(activity.start_date);
		var year = yearFromDate(date);
		var fastestRideObj = leaderboard.yearById[year].fastestRide;

		var updateFastestRide = function() {
			fastestRideObj.activity = activity;
			fastestRideObj.athleteId = activity.athlete.id;
			fastestRideObj.athleteName = buildAthleteName(athletesById[activity.athlete.id]);
			fastestRideObj.averageSpeed = calculateActivitySpeed(activity);
		}

		// If the average speed for this ride is higher than the current maximum average, then
		// replace the existing one.  Only consider rides over 10km in length.
		if (activity.distance > 10000) {
			if (fastestRideObj.activity) {
				if (calculateActivitySpeed(fastestRideObj.activity) < calculateActivitySpeed(activity))
					updateFastestRide();
			} else {
				updateFastestRide();
			};
		}
	});
}

function stripIndexes(leaderboard) {
	delete leaderboard.yearById;
	leaderboard.year.forEach(function(year) {
		delete year.summaryByAthleteId;
		delete year.monthById;
		delete year.weekById;
		delete year.monthlyWinsByAthleteId;
		delete year.weeklyWinsByAthleteId;
		year.month.forEach(function(month) {
			delete month.summaryByAthleteId;
		});
		year.week.forEach(function(week) {
			delete week.summaryByAthleteId;
		});
	});
}

function buildLeaderboard(athletes, activities) {
	activities = activities.filter(function(activity) { return activity.type == 'Ride' } );
	// Build the complete set of years.
	var yearsSet = buildYearsSet(activities);
	// Build the complete set of months.
	var monthsSet = buildMonthsSet(activities);
	// Build the complete set of weeks.
	var weeksSet = buildWeeksSet(activities);
	// Create an index of athletes by id.
	var athletesById = buildAthletesById(athletes);

	// Build the skeleton leaderboard.
	var leaderboard = buildSkeleton(yearsSet, monthsSet, weeksSet, athletes);

	// Calculate leaderboard statistics.
	calculateSummary(leaderboard, activities);
	calculateWins(leaderboard);
	calculateLongestRide(leaderboard, activities, athletesById);
	calculateFastestRide(leaderboard, activities, athletesById);

	// Strip index objects out of the leaderboard.
	stripIndexes(leaderboard);

	console.log("leaderboard: " + util.stringify(leaderboard));

	return leaderboard;
}

module.exports.build = buildLeaderboard;
