'use strict';

const ddbGeo = require('dynamodb-geo');
const AWS = require('aws-sdk');

module.exports.getNearestLocations = (event, context, callback) => {
    // Use a local DB for the example.
    const ddb = new AWS.DynamoDB();

    const config = new ddbGeo.GeoDataManagerConfiguration(ddb, process.env.DYNAMODB_TABLE);

    const capitalsManager = new ddbGeo.GeoDataManager(config);

    capitalsManager.queryRadius({
        RadiusInMeter: 100000,
        CenterPoint: {
            latitude: 52.225730,
            longitude: 0.149593
        }
    }).then((data) => {
        console.log(data);

        const response = {
            statusCode: 200,
            body: JSON.stringify(data)
        };

        callback(null, response);
    });
};
