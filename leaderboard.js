'use strict';

// Example leaderboard
//{
//	"years" : [
//		{
//			"year" : 2015
//			"records" : {
//				"distance" : [
//					{
//						"athleteId" : 1234,
//						"distance" : 2500
//					}
//				]
//			}
//		}
//	]
//	"2015" : {
//		"records" : {
//			"distance" : {
//				"1234" : "2500"
//			}
//		}
//	}
//}

function getYear(dateString) {
	var date = Date.parse(dateString).getFullYear();
}

function getYearlyRecords(leaderboard, year) {
	var yearlyLeaderboard = leaderboard.years.find(function(a) { a.year == year });

	if (!yearlyLeaderboard) {
		yearlyLeaderboard = { year: year, distance: 0 };
		leaderboard.years.push(yearlyLeaderboard);
	}

	return yearlyLeaderboard.records;
}

var leaderboardBuilders = {
	distance : {
		itemHandler : function(record, activity) {
			var athleteRecord = record
			var athleteId = activity.athlete.id;
			var existingDistance = record[athleteId];
			if (!existingDistance) {
				existingDistance = 0;
			}
			record[athleteId] = existingDistance + activity.distance;
		},
		finalHandler : function(record) {

			// Sort by descending distance.
		}
	}
}

function buildLeaderboard(activities, callback) {
	var initialValue = {
		"years" : {}
	};
	var leaderboard = activities.reduce(
		function(leaderboard, activity, index, array) {
			// Get the year portion of the activity date.
			var year = Date.parse(activity.start_date).getFullYear();
			// Get the records item for the year.
			var records = getYearlyRecords(leaderboard, year);

			// Process each of the record types.
			Object.keys(leaderboardBuilders).forEach(function(leaderboardKey, index, array) {
				var leaderboardHandler = leaderboardBuilders[leaderboardKey].itemHandler;

				// Get the specific leaderboard record.
				if (!records.hasOwnProperty(leaderboardKey)) {
					records[leaderboardKey] = {};
				}
				var record = records[leaderboardKey];

				// Incorporate the activity in the results using the leaderboard builder.
				leaderboardHandler(record, activity);
			});
		},
		initialValue);
	// Perform finalization of leaderboard.
	//TODO: Finalize leaderboard.
	return leaderboard;
}

module.exports.buildLeaderboard = buildLeaderboard;

