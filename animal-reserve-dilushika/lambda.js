let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let rekog = new AWS.Rekognition();


exports.handler = function (event, context, callback) {
    //console.log(JSON.stringify(event, null,2));
    let s3 = event.Records[0].s3;
    rekog.detectLabels({
        Image: {
            S3Object: {
                Bucket: s3.bucket.name,
                Name: s3.object.key
            }
        },
        MaxLabels: 1
    }).promise()
        .then(data => {
            let lable = data.lables[0].Name;
            ddb.put({
                TableName: 'Animal-app-dilushika',
                Item: {
                    'name': s3.object.key,
                    'lable': lable
                }
            }).promise()
                .then((data) => {
                    callback(null, {});
                    //your logic goes here
                })
                .catch((err) => {
                    //handle error
                    callback(err);
                });
            console.log(data);
            
        })
        .catch(err => callback(err));

    // callback(null, {"message": "Successfully executed"});
}