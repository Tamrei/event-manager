(function () {
    'use strict';

    angular
        .module('calendar.service', [])
        .factory('calendarService', calendarService);

    function calendarService() {
        var service = {
            getWeeksInYear: getWeeksInYear,
            getWeekByNumber: getWeekByNumber,
            getWeekNumberByDate: getWeekNumberByDate,
            getCurrentWeek: getCurrentWeekNumber
        };
        return service;

        /**
         * returns number of weeks in year
         *
         * @param year
         * @returns {number}
         */
        function getWeeksInYear(year) {
            var lastDayOfThisYear = new Date(year, 12 - 1, 31);
            // if last day of this year ends with saturday
            if (lastDayOfThisYear.getDay() == 6) {
                return 52;
            } else {
                return 51;
            }
        }

        /**
         * returns array with 7 WeekDay objects which represents each day in week
         * @see model/weekDay.js
         *
         * @param weekNumber requested week number
         * @param year number from with we wanna get weeks
         * @returns {Array}
         */
        function getWeekByNumber(weekNumber, year) {
            var firstDayOfTheYear = new Date(year, 0, 1);
            var week = [];

            // amount of the days from the previous year that are part of this year first week
            var daysFromTheLastYear = firstDayOfTheYear.getDay();

            var nextDay = new Date(firstDayOfTheYear);
            nextDay.setDate(firstDayOfTheYear.getDate() - daysFromTheLastYear + (7 * weekNumber));

            for (var i = 0; i < 7; i++) {
                var thisWeekDay = new Date(nextDay);
                thisWeekDay.setDate(nextDay.getDate() + i);

                var today = new Date();

                var weekDay = new WeekDay(thisWeekDay);
                weekDay.today = today.getFullYear() == thisWeekDay.getFullYear() && today.getMonth() == thisWeekDay.getMonth() && today.getDate() == thisWeekDay.getDate();

                week.push(weekDay);
            }
            return week;
        }

        /**
         * returns week number of a requested date
         *
         * @param day
         * @param month
         * @param year
         * @returns {number}
         */
        function getWeekNumberByDate(day, month, year) {
            var firstDayOfTheYear = new Date(year, 0, 1);
            var requestedDate = new Date(year, month - 1, day);

            // all days from the start of requested year to requested date
            var thisYearDays = Math.round((requestedDate - firstDayOfTheYear) / (1000 * 60 * 60 * 24));

            // amount of the days from the previous year that are part of this year first week
            var daysFromTheLastYear = firstDayOfTheYear.getDay();

            var totalDays = thisYearDays + daysFromTheLastYear;

            var result = totalDays / 7;

            if (result < 1) return 0;
            else return result | 0;
        }

        /**
         * return week number of a today's date
         *
         * @returns {number}
         */
        function getCurrentWeekNumber() {
            var currentDate = new Date();
            return getWeekNumberByDate(currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear());
        }
    }
})();
