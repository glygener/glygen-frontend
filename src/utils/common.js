/**
 *
 * @param {String} date Date string returned by backend (format: YYYY-MM-DD hh:mm:ss Z offset)
 * returns date string in MM/DD/YYYY format
 */
export function getDateMMDDYYYY(date) {
	var monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	var day = date.slice(8, 10);
	var monthIndex = parseInt(date.slice(5, 7)) - 1;
	var year = date.slice(0, 4);

	return day + '/' + monthNames[monthIndex] + '/' + year;
}

export function validateEmail(email) {
	if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	}
	return false;
}

export function sortDropdown(a, b) {
	if (a.name < b.name) {
		return -1;
	} else if (b.name < a.name) {
		return 1;
	}
	return 0;
}