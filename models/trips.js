import Utils from "./utils";

const utils = new Utils();

class Trips {

    collectTripData(line) {
        try {
            const data = JSON.parse(line);
            const date = new Date(data.time.$date);
            return {
                day: utils.getDateKey(date),
                time: date,
                accOn: data.isAccOn,
                speed: data.speed,
                mileage: data.other.mileage
            };
        } catch (error) {
            console.log("failed to parse json", error);
        }
    }

    processTripData(day, list) {
        //if list is empty nothing to do
        if(list.length <= 0) {
            return;
        }

        let index = 0;
        let listLength = list.length;
        let startMileage;
        let maxSpeed = 0;
        let tripStartTime;
        let trips = [];
        let tripStarted = true;

        //accOn defines new trip start
        for(var item of list) {
            index++;
            if(tripStarted && !item.accOn) {
                //haven't started new trip yet
                continue;
            }

            if(tripStarted) {
                tripStartTime = item.time.getTime();
                startMileage = item.mileage;
                maxSpeed = 0;
                tripStarted = false;
            }

            //calc max speed
            if(item.speed > maxSpeed) {
                maxSpeed = item.speed;
            }

            //if acc state changes or end of the list/day means end of a trip
            if(!item.accOn || listLength === index) {
                tripStarted = true;
                //changed, so new trip
                trips.push({
                    maxSpeed: maxSpeed,
                    totalDistance: Math.ceil(item.mileage - startMileage),
                    tripDuration: ((item.time.getTime() - tripStartTime) / (1000 * 60)).toFixed(1) + " Minutes"
                })
            }
        }
        return JSON.stringify({
            day: day,
            trips: trips
        });
    }
}

export default Trips;