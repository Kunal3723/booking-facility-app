import fs from 'fs';

export class Facility {
    constructor(name, rates) {
        this.name = name;
        this.rates = rates;
        this.bookings = [];
    }

    calculateCost(startTime, endTime) {
        let totalCost = 0;
        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
            let hour = currentTime.getHours();
            let rate = 0;

            if (this.rates.length === 1) {
                rate = this.rates[0].rate;
            } else {
                for (let i = 0; i < this.rates.length; i++) {
                    if (hour >= this.rates[i].start && hour < this.rates[i].end) {
                        rate = this.rates[i].rate;
                        break;
                    }
                }
            }

            totalCost += rate;
            currentTime.setHours(currentTime.getHours() + 1);
        }

        return totalCost;
    }

    isAvailable(startTime, endTime) {
        return this.bookings.every(booking => {
            return endTime <= booking.startTime || startTime >= booking.endTime;
        });
    }

    book(startTime, endTime) {
        if (!this.isAvailable(startTime, endTime)) {
            return `Booking Failed, Already Booked`;
        }

        let cost = this.calculateCost(startTime, endTime);
        this.bookings.push({ startTime, endTime });
        return `Booked, Rs. ${cost}`;
    }
}

export const clubhouse = new Facility('Clubhouse', [
    { start: 10, end: 16, rate: 100 },
    { start: 16, end: 22, rate: 500 }
]);

export const tennisCourt = new Facility('Tennis Court', [
    { start: 0, end: 24, rate: 50 }
]);

export function parseTime(dateString, timeString) {
    let [day, month, year] = dateString.split('-').map(Number);
    let [hours, minutes] = timeString.split(':').map(Number);
    let date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return date;
}

export function bookFacility(facility, dateString, startTimeString, endTimeString) {
    let startTime = parseTime(dateString, startTimeString);
    let endTime = parseTime(dateString, endTimeString);
    return facility.book(startTime, endTime);
}


// Function to process bookings from input file
function processBookingsFromFile() {
    fs.readFile('input.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const inputs = data.trim().split('\n');
        let results = [];

        inputs.forEach(input => {
            let [facilityName, dateString, TimeString] = input.split(',').map(item => item.trim());
            let facility;
            let [startTimeString, endTimeString] = TimeString.split('-').map(item => item.trim());

            if (facilityName.toLowerCase() === 'clubhouse') {
                facility = clubhouse;
            } else if (facilityName.toLowerCase() === 'tennis court') {
                facility = tennisCourt;
            } else {
                results.push(`Invalid facility name: ${facilityName}`);
                return;
            }

            results.push(bookFacility(facility, dateString, startTimeString, endTimeString));
        });

        fs.writeFile('output.txt', results.join('\n'), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Results written to output.txt');
        });
    });
}

// processBookingsFromFile();

// Assumptions 
// 1. Time will be between 10:00-22:00 otherwise it will show 'Booked, Rs. 0'
// 2. Duration(time difference) will always be in hours only. Not like this: 10:45-11:55 -> (1 hour 10min) 