const https = require('https');

exports.handler = async (event) => {
  const property = event.queryStringParameters?.property || 'vendeghaz';
  
  const urls = {
    vendeghaz: 'https://ical.booking.com/v1/export?t=1738aa3b-6541-4b6d-bec5-5f25a14ec048',
    nyaralo: 'https://ical.booking.com/v1/export?t=2e189560-8ea3-4d69-a969-b995f7f0b0e9'
  };
  
  const url = urls[property];
  if (!url) return { statusCode: 400, body: 'Invalid property' };

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'text/calendar',
            'Access-Control-Allow-Origin': '*'
          },
          body: data
        });
      });
    }).on('error', (e) => {
      resolve({ statusCode: 500, body: e.message });
    });
  });
};
