import aws from 'aws-sdk';
import randomstring from 'randomstring';
import slugify from 'slugify';

const file = (request, response) => {
    aws.config.update({
        accessKeyId: process.env.AMAZON_ACCESS_KEY,
        secretAccessKey: process.env.AMAZON_SECRET_KEY
    });
    var s3 = new aws.S3();
    var key = randomstring.generate(16) + slugify(request.query.s3_object_name);
    var s3_params = {
        Bucket: 'sosjournals',
        Key: key,
        Expires: 100000000,
        ACL: 'public-read',
        ContentType: request.query.s3_object_type
    };

    s3.getSignedUrl('putObject', s3_params, function(err, data) {
        if (err) {
            response.end(
                JSON.stringify({
                    success: false
                })
            );
        } else {
            var return_data = {
                success: true,
                signed_request: data,
                url: 'https://s3.amazonaws.com/sosjournals/' + key
            };
            response.end(JSON.stringify(return_data));
        }
    });
};

export default file;
