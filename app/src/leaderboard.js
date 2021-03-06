'use strict';

const _ = require('lodash');
const dateUtil = require('./date-util');

function buildDateSet(activities, dateMapper) {
  const reduceFunction = function(resultSet, activity) {
    // Reduce the date to an integer of reduced granularity.
    const item = dateMapper(new Date(activity.start_date));

    if (!_.includes(resultSet, item)) {
      resultSet.push(item);
    }

    return resultSet;
  };

  return activities.reduce(reduceFunction, []);
}

// Get the unique list of years present in the list of activities.
function buildYearsSet(activities) {
  return buildDateSet(activities, dateUtil.yearFromDate);
}

// Get the unique list of months present in the list of activities.
function buildMonthsSet(activities) {
  return buildDateSet(activities, dateUtil.monthFromDate);
}

// Get the unique list of weeks present in the list of activities.
function buildWeeksSet(activities) {
  return buildDateSet(activities, dateUtil.weekFromDate);
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
  const reduceSummaryById = function(summaryByAthleteId, summaryRecord) {
    summaryByAthleteId[summaryRecord.athleteId] = summaryRecord;
    return summaryByAthleteId;
  };

  // Build an array of athlete summary objects.
  const summary = athletes.map(function(athlete) {
    return {
      athleteId: athlete.id,
      athleteName: buildAthleteName(athlete),
      distance: 0,
      movingTime: 0,
      activityCount: 0
    };
  });
  // Create an index of athlete distance objects by athlete id.
  const summaryByAthleteId = summary.reduce(reduceSummaryById, {});

  return [summary, summaryByAthleteId];
}

function buildAthletesWins(athletes) {
  const reduceById = function(winsByAthleteId, winsRecord) {
    winsByAthleteId[winsRecord.athleteId] = winsRecord;
    return winsByAthleteId;
  };

  // Build an array of athlete win objects.
  const wins = athletes.map(function(athlete) {
    return {
      athleteId: athlete.id,
      athleteName: athlete.firstname + ' ' + athlete.lastname,
      wins: 0
    };
  });
  // Create an index of athlete wins objects by athlete id.
  const winsByAthleteId = wins.reduce(reduceById, {});

  return [wins, winsByAthleteId];
}

function buildSkeleton(yearsSet, monthsSet, weeksSet, athletes) {
  // Build an array of year objects sorted by reverse chronological time.
  const yearObj = yearsSet.map(function(currentYear) {
    // Build athlete summary objects.
    const summariesTuple = buildAthleteSummaries(athletes);
    const summaries = summariesTuple[0];
    const summariesByAthleteId = summariesTuple[1];

    // Build monthly and weekly win totals objects.
    const monthlyWinsTuple = buildAthletesWins(athletes);
    const weeklyWinsTuple = buildAthletesWins(athletes);

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
      fastestRide: []
    };
  }).sort(function(a, b) {
    return b.year - a.year;
  });
  // Create an index of year objects by year id.
  const yearById = yearObj.reduce(function(yearById, yearRecord) {
    yearById[yearRecord.year] = yearRecord;
    return yearById;
  }, {});

  // Build arrays of month objects grouped by year and sorted by reverse chronological time.
  monthsSet.forEach(function(currentMonth) {
    // Build athlete summary objects.
    const summariesTuple = buildAthleteSummaries(athletes);
    const summaries = summariesTuple[0];
    const summariesByAthleteId = summariesTuple[1];

    // Add the month to the relevant year.
    const monthObj = {
      month: currentMonth,
      distance: summaries,
      averageSpeed: summaries.slice(),
      activityCount: summaries.slice(),
      summaryByAthleteId: summariesByAthleteId
    };
    yearById[dateUtil.yearFromMonth(currentMonth)].month.push(monthObj);
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
    const summariesTuple = buildAthleteSummaries(athletes);
    const summaries = summariesTuple[0];
    const summariesByAthleteId = summariesTuple[1];

    // Add the week to the relevant year.
    const weekObj = {
      week: currentWeek,
      distance: summaries,
      averageSpeed: summaries.slice(),
      activityCount: summaries.slice(),
      summaryByAthleteId: summariesByAthleteId
    };
    yearById[dateUtil.yearFromWeek(currentWeek)].week.push(weekObj);
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
    const date = new Date(activity.start_date);
    const year = dateUtil.yearFromDate(date);
    const month = dateUtil.monthFromDate(date);
    const monthYear = dateUtil.yearFromMonth(month);
    const week = dateUtil.weekFromDate(date);
    const weekYear = dateUtil.yearFromWeek(week);

    // Get all the distance records that the activity fits into.
    const summaryItems = [
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
      summaryItem.activityCount++;

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
      const fieldA = fieldReader(a);
      const fieldB = fieldReader(b);

      // Fields may be null.  We will leave the order unchanged if both are null,
      // otherwise the one with a value will be placed higher.
      if (!fieldA && !fieldB) {
        return 0;
      } else if (!fieldA) {
        return 1;
      } else if (!fieldB) {
        return -1;
      } else {
        return fieldB - fieldA;
      }
    };
  }

  function timeIntervalSorter(interval) {
    interval.distance.sort(descendingComparator(function(item) { return item.distance; }));
    interval.averageSpeed.sort(descendingComparator(function(item) { return item.averageSpeed; }));
    interval.activityCount.sort(descendingComparator(function(item) { return item.activityCount; }));
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
      const athleteId = monthObj.distance[0].athleteId;
      yearObj.monthlyWinsByAthleteId[athleteId].wins += 1;
    });
    yearObj.monthlyWins.sort(function(a, b) {
      return b.wins - a.wins;
    });
    yearObj.week.forEach(function(weekObj) {
      const athleteId = weekObj.distance[0].athleteId;
      yearObj.weeklyWinsByAthleteId[athleteId].wins += 1;
    });
    yearObj.weeklyWins.sort(function(a, b) {
      return b.wins - a.wins;
    });
  });
}

function calculateLongestRide(leaderboard, activities, athletesById) {
  activities.forEach(function(activity) {
    const date = new Date(activity.start_date);
    const year = dateUtil.yearFromDate(date);
    const longestRideObj = leaderboard.yearById[year].longestRide;

    const updateLongestRide = function() {
      longestRideObj.activity = activity;
      longestRideObj.athleteId = activity.athlete.id;
      longestRideObj.athleteName = buildAthleteName(athletesById[activity.athlete.id]);
    };

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

function calculateFastestRide(leaderboard, activities, athletesById) {
  const MIN_DISTANCE = 10000;
  const MAX_TRACKED = 3;
  function calculateActivitySpeed(activity) {
    if (activity.distance > 0)
      return Math.round(activity.distance / activity.moving_time * 3.600 * 10) / 10;
    else
      return 0;
  }

  function compareBySpeed(a, b) {
    if (a.distance < MIN_DISTANCE && b.distance < MIN_DISTANCE)
      return calculateActivitySpeed(b) - calculateActivitySpeed(a);
    else if (a.distance < MIN_DISTANCE)
      return 1;
    else if (b.distance < MIN_DISTANCE)
      return -1;
    else
      return calculateActivitySpeed(b) - calculateActivitySpeed(a);
  }
  function compareRidesBySpeed(a, b) {
    return compareBySpeed(a.activity, b.activity);
  }

  activities.forEach(function(activity) {
    const date = new Date(activity.start_date);
    const year = dateUtil.yearFromDate(date);
    const fastestRides = leaderboard.yearById[year].fastestRide;

    const updateFastestRides = function() {
      //console.log('adding to list');
      // Add this activity to the list, sort, and keep the top 3.
      fastestRides.push({
        activity: activity,
        athleteId: activity.athlete.id,
        athleteName: buildAthleteName(athletesById[activity.athlete.id]),
        averageSpeed: calculateActivitySpeed(activity)
      });
      fastestRides.sort(compareRidesBySpeed);
      if (fastestRides.length > MAX_TRACKED) fastestRides.pop();
    };

    // Check if this activity is faster than the existing slowest activity.  If so,
    // update the list.
    if (fastestRides.length >= MAX_TRACKED) {
      if (compareBySpeed(activity, fastestRides[fastestRides.length - 1].activity) < 0)
        updateFastestRides();
    } else
      updateFastestRides();
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
  const blockedRideList = [356959035, 356959045, 356959046];
  // Only include bike rides.
  activities = activities.filter(function(activity) { return activity.type == 'Ride'; } );
  // Block Frankenstein rides.
  activities = activities.filter(function(activity) { return blockedRideList.indexOf(activity.id) < 0; } );
  // Build the complete set of years.
  const yearsSet = buildYearsSet(activities);
  // Build the complete set of months.
  const monthsSet = buildMonthsSet(activities);
  // Build the complete set of weeks.
  const weeksSet = buildWeeksSet(activities);
  // Create an index of athletes by id.
  const athletesById = buildAthletesById(athletes);

  // Build the skeleton leaderboard.
  const leaderboard = buildSkeleton(yearsSet, monthsSet, weeksSet, athletes);

  // Calculate leaderboard statistics.
  calculateSummary(leaderboard, activities);
  calculateWins(leaderboard);
  calculateLongestRide(leaderboard, activities, athletesById);
  calculateFastestRide(leaderboard, activities, athletesById);

  // Strip index objects out of the leaderboard.
  stripIndexes(leaderboard);

  //console.log("leaderboard: " + util.stringify(leaderboard));

  return leaderboard;
}

module.exports.build = buildLeaderboard;
