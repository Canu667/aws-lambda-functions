'use strict';

import { APIGatewayProxyEvent, Handler, Context, Callback } from 'aws-lambda';
import * as geolib from 'geolib';

interface Response {
    statusCode: number;
    body: string;
}

const capitals = [
    {
        "country": "Albania",
        "capital": "Tirana",
        "latitude": 41.33,
        "longitude": 19.82
    },
    {
        "country": "Andorra",
        "capital": "Andorra la Vella",
        "latitude": 42.51,
        "longitude": 1.52
    },
    {
        "country": "Austria",
        "capital": "Vienna",
        "latitude": 48.21,
        "longitude": 16.37
    },
    {
        "country": "Belarus",
        "capital": "Minsk",
        "latitude": 53.9,
        "longitude": 27.57
    },
    {
        "country": "Belgium",
        "capital": "Brussels",
        "latitude": 50.85,
        "longitude": 4.35
    },
    {
        "country": "Bosnia and Herzegovina",
        "capital": "Sarajevo",
        "latitude": 43.85,
        "longitude": 18.36
    },
    {
        "country": "Bulgaria",
        "capital": "Sofia",
        "latitude": 42.7,
        "longitude": 23.32
    },
    {
        "country": "Croatia",
        "capital": "Zagreb",
        "latitude": 45.81,
        "longitude": 15.98
    },
    {
        "country": "Cyprus",
        "capital": "Nicosia",
        "latitude": 35.17,
        "longitude": 33.37
    },
    {
        "country": "Czech Republic",
        "capital": "Prague",
        "latitude": 50.09,
        "longitude": 14.42
    },
    {
        "country": "Denmark",
        "capital": "Copenhagen",
        "latitude": 55.68,
        "longitude": 12.57
    },
    {
        "country": "Estonia",
        "capital": "Tallinn",
        "latitude": 59.44,
        "longitude": 24.75
    },
    {
        "country": "Faroe Islands",
        "capital": "Tórshavn",
        "latitude": 62.01,
        "longitude": -6.77
    },
    {
        "country": "Finland",
        "capital": "Helsinki",
        "latitude": 60.17,
        "longitude": 24.94
    },
    {
        "country": "France",
        "capital": "Paris",
        "latitude": 48.85,
        "longitude": 2.35
    },
    {
        "country": "Germany",
        "capital": "Berlin",
        "latitude": 52.52,
        "longitude": 13.41
    },
    {
        "country": "Gibraltar",
        "capital": "Gibraltar",
        "latitude": 36.14,
        "longitude": -5.35
    },
    {
        "country": "Greece",
        "capital": "Athens",
        "latitude": 37.98,
        "longitude": 23.72
    },
    {
        "country": "Guernsey",
        "capital": "St Peter Port",
        "latitude": 49.46,
        "longitude": -2.54
    },
    {
        "country": "Hungary",
        "capital": "Budapest",
        "latitude": 47.5,
        "longitude": 19.04
    },
    {
        "country": "Iceland",
        "capital": "Reykjavík",
        "latitude": 64.14,
        "longitude": -21.9
    },
    {
        "country": "Ireland",
        "capital": "Dublin",
        "latitude": 53.33,
        "longitude": -6.25
    },
    {
        "country": "Isle of Man",
        "capital": "Douglas",
        "latitude": 54.15,
        "longitude": -4.48
    },
    {
        "country": "Italy",
        "capital": "Rome",
        "latitude": 41.89,
        "longitude": 12.48
    },
    {
        "country": "Jersey",
        "capital": "Saint Helier",
        "latitude": 49.19,
        "longitude": -2.1
    },
    {
        "country": "Kosovo",
        "capital": "Pristina",
        "latitude": 42.67,
        "longitude": 21.17
    },
    {
        "country": "Latvia",
        "capital": "Riga",
        "latitude": 56.95,
        "longitude": 24.11
    },
    {
        "country": "Liechtenstein",
        "capital": "Vaduz",
        "latitude": 47.14,
        "longitude": 9.52
    },
    {
        "country": "Lithuania",
        "capital": "Vilnius",
        "latitude": 54.69,
        "longitude": 25.28
    },
    {
        "country": "Luxembourg",
        "capital": "Luxembourg",
        "latitude": 49.61,
        "longitude": 6.13
    },
    {
        "country": "Macedonia",
        "capital": "Skopje",
        "latitude": 42,
        "longitude": 21.43
    },
    {
        "country": "Malta",
        "capital": "Valletta",
        "latitude": 35.9,
        "longitude": 14.51
    },
    {
        "country": "Moldova",
        "capital": "Chişinău",
        "latitude": 47.01,
        "longitude": 28.86
    },
    {
        "country": "Monaco",
        "capital": "Monaco",
        "latitude": 43.73,
        "longitude": 7.42
    },
    {
        "country": "Montenegro",
        "capital": "Podgorica",
        "latitude": 42.44,
        "longitude": 19.26
    },
    {
        "country": "Netherlands",
        "capital": "Amsterdam",
        "latitude": 52.37,
        "longitude": 4.89
    },
    {
        "country": "Norway",
        "capital": "Oslo",
        "latitude": 59.91,
        "longitude": 10.75
    },
    {
        "country": "Poland",
        "capital": "Warsaw",
        "latitude": 52.23,
        "longitude": 21.01
    },
    {
        "country": "Portugal",
        "capital": "Lisbon",
        "latitude": 38.72,
        "longitude": -9.13
    },
    {
        "country": "Romania",
        "capital": "Bucharest",
        "latitude": 44.43,
        "longitude": 26.11
    },
    {
        "country": "Russia",
        "capital": "Moscow",
        "latitude": 55.75,
        "longitude": 37.62
    },
    {
        "country": "San Marino",
        "capital": "San Marino",
        "latitude": 43.94,
        "longitude": 12.45
    },
    {
        "country": "Serbia",
        "capital": "Belgrade",
        "latitude": 44.8,
        "longitude": 20.47
    },
    {
        "country": "Slovakia",
        "capital": "Bratislava",
        "latitude": 48.15,
        "longitude": 17.11
    },
    {
        "country": "Slovenia",
        "capital": "Ljubljana",
        "latitude": 46.05,
        "longitude": 14.51
    },
    {
        "country": "Spain",
        "capital": "Madrid",
        "latitude": 40.42,
        "longitude": -3.7
    },
    {
        "country": "Svalbard and Jan Mayen",
        "capital": "Longyearbyen",
        "latitude": 78.22,
        "longitude": 15.64
    },
    {
        "country": "Sweden",
        "capital": "Stockholm",
        "latitude": 59.33,
        "longitude": 18.06
    },
    {
        "country": "Switzerland",
        "capital": "Berne",
        "latitude": 46.95,
        "longitude": 7.45
    },
    {
        "country": "Ukraine",
        "capital": "Kiev",
        "latitude": 50.45,
        "longitude": 30.52
    },
    {
        "country": "United Kingdom",
        "capital": "London",
        "latitude": 51.51,
        "longitude": -0.13
    },
    {
        "country": "Vatican",
        "capital": "Vatican",
        "latitude": 41.9,
        "longitude": 12.45
    }
]

const endpoint: Handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const locations = capitals.reduce((object, location) => {
        object[location.capital] = {
            latitude: location.latitude,
            longitude: location.longitude
        };

        return object;
    }, {});

    const location = {
        latitude: event.pathParameters.latitude,
        longitude: event.pathParameters.longitude
    };

    const response: Response = {
        statusCode: 200,
        body: JSON.stringify(geolib.findNearest(location, locations, 0, 4))
    };

    callback(null, response);
};

export { endpoint }
