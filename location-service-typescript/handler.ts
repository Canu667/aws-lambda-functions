'use strict';

interface Response {
    statusCode: number;
    body: string;
}

import { Handler, Context, Callback } from 'aws-lambda';
import * as geolib from 'geolib';

const endpoint: Handler = (event: any, context: Context, callback: Callback) => {
    const locations = {
        a: {latitude: 52.516272, longitude: 13.377722},
        b: {latitude: 51.518, longitude: 7.45425},
        c: {latitude: 51.503333, longitude: -0.119722}
    };

    const response: Response = {
        statusCode: 200,
        body: JSON.stringify(geolib.orderByDistance({latitude: 51.515, longitude: 7.453619},locations))
    };

    callback(null, response);
};

export { endpoint }
