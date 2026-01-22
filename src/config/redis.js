// Redis client configuration
const { createClient } = require('redis');

const redisclient = createClient({
    username: 'default',
    password: '4LjA2kbU9odRYFrGo7gtaHMrp9zUqO01',
    socket: {
        host: 'redis-16955.c83.us-east-1-2.ec2.cloud.redislabs.com',
        port: 16955
    }
});

redisclient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

module.exports = redisclient;
