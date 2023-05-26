export default function addToCache(key,value,client) {
    client.set(key, value, (error, reply) => {
        if (error) {
          console.error('Error setting data in cache:', error);
        } else {
          console.log('Data set in cache with key,value:\t',key,value, reply);
        }
      });
};
