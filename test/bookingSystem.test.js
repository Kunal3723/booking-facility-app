import { expect } from 'chai'
import { bookFacility, clubhouse, tennisCourt } from './main.js';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
describe('Facility Booking System', () => {
    before(() => {
        // Reset the bookings for each test
        clubhouse.bookings = [];
        tennisCourt.bookings = [];
    });

    // Read test cases from test.txt
    const testFilePath = path.join(__dirname, 'test.txt');
    const data = fs.readFileSync(testFilePath, 'utf8');
    const lines = data.trim().split('\n');

    lines.forEach((line, index) => {
        const [facilityName, dateString, timeRange, ...expectedOutputArr] = line.split(', ').map(item => item.trim());
        const [startTimeString, endTimeString] = timeRange.split(' - ').map(item => item.trim());
        const expectedOutput = expectedOutputArr.join(', ');

        it(`Test case ${index + 1}: ${facilityName}, ${dateString}, ${timeRange}`, () => {
            let facility;
            if (facilityName.toLowerCase() === 'clubhouse') {
                facility = clubhouse;
            } else if (facilityName.toLowerCase() === 'tennis court') {
                facility = tennisCourt;
            } else {
                throw new Error(`Invalid facility name: ${facilityName}`);
            }

            const result = bookFacility(facility, dateString, startTimeString, endTimeString);
            expect(result).to.equal(expectedOutput);
        });
    });
});