import express from 'express';
import lineReader from "line-reader";
import Trips from '../models/trips';
import Locations from '../models/locations';

const router = express.Router();
const trips = new Trips();
const locations = new Locations();

router.get('/locations', (req, res) => {
    res.write("[");
    var locationList = [];
    var previousLocation = false;
    lineReader.eachLine('events-sorted.json', async function (line, last) {

        //only collect the data we care about
        const data = await locations.collectLocationData(line);

        //we only want to collect data with location ID's, so skip the ones that are null
        if(!previousLocation) previousLocation = data.locationID;

        if(data.locationID !== null) {

            //if location is different write data and reset list
            if(previousLocation !== data.locationID && locationList.length > 0) {
                res.write(await locations.processLocationData(previousLocation, locationList));
                if(!last) res.write(',');
                //reset list and update day
                locationList = [];
                previousLocation = data.locationID;
            }
            locationList.push(data);
        }

        // if last we need to write, and close response
        if(last) {
            if(locationList.length > 0)	res.write(await locations.processLocationData(previousLocation, locationList));
            locationList = [];
            res.write(']');
            res.end();
            return false;
        }
    })
});

router.get('/trips', (req, res) => {
    res.write("[");
    var previousDay = null;
    var dayList = [];

    lineReader.eachLine('events-sorted.json', async function (line, last) {

        //only collect the data we care about
        const data = await trips.collectTripData(line);

        if(previousDay == null)  previousDay = data.day;

        //if day is different write data and reset list
        if(previousDay !== data.day) {
            res.write(await trips.processTripData(previousDay, dayList));
            if(!last) res.write(',');
            //reset list and update day
            dayList = [];
            previousDay = data.day;
        }

        dayList.push(data);

        // if last we need to write, and close response
        if(last) {
            res.write(await trips.processTripData(previousDay, dayList));
            dayList = [];
            res.write(']');
            res.end();
            return false;
        }
    })
});


export default router;