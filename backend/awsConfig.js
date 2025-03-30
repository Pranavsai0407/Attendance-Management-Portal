const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

/*const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
});*/


const rekognition = new AWS.Rekognition();

const uploadImage = async (imageData, imageName) => {
    //console.log(imageName);
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageName,
        Body: Buffer.from(imageData, "base64"),
        ContentType: 'image/jpeg',
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // URL of the uploaded image
    } catch (err) {
        console.error('S3 Upload Error:', err);
        throw new Error('Failed to upload image');
    }
};

module.exports = {rekognition,uploadImage};
