const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

module.exports.handle = async (data, event) => {
    console.log(JSON.stringify({
        dueDate: data.dueDate,
        email: data.email
    }));
    const stateMachineArn = process.env.STATEMACHINE_ARN;
    const result = await stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify({
            dueDate: data.dueDate,
            email: data.email
        }),
    }).promise();
    console.log(`State machine ${stateMachineArn} executed successfully`, result);
    return result;
}