'use strict';

import { APIGatewayProxyEvent, Handler, Context, Callback } from 'aws-lambda';
import * as geolib from 'geolib';
const capitals = require('./capitals.json');

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

    const response: LocationResponse = {
        statusCode: 200,
        body: JSON.stringify(geolib.findNearest(location, locations, 0, 4))
    };

    callback(null, response);
};

export { endpoint }
