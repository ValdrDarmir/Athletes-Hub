function setTimeOfDate(date: Date, timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number);

    // Check if the hours and minutes are valid
    if (!isNaN(hours) && !isNaN(minutes)) {
        date.setHours(hours, minutes, 0, 0);
    } else {
        console.error('Invalid time format:', timeString);
    }
}

export default setTimeOfDate
