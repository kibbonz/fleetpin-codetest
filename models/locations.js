class Locations {

    collectLocationData(line) {
        try {
            const data = JSON.parse(line);
            const date = new Date(data.time.$date);
            return {
                locationID: data._location !== null ? data._location.$oid : null,
                time: date,
                mileage: data.other.mileage,
            };
        } catch (error) {
            console.log("failed to parse json", error);
        }
    }

    processLocationData(day, list) {
        //if list is empty nothing to do
        if(list.length <= 0) {
            return;
        }

        let firstItem = list[0];
        let lastItem = list[list.length-1];

        return JSON.stringify({
            locationID: firstItem.locationID,
            distanceTravelled: Math.ceil(lastItem.mileage - firstItem.mileage),
            timeAtLocation: ((lastItem.time.getTime() - firstItem.time.getTime()) / (1000 * 60)).toFixed(1) + " Minutes"
        });
    }
}

export default Locations;