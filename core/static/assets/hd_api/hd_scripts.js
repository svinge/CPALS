const headers = {
    "Accept": "application/json",
    "X-Authenticate-User": "cpal",
    "X-Authenticate-Password": "cpal"
}

const URL = 'https://p184-geps-production-api.hd-rtls.com/'

hd_scripts = {


test: function() {
    const x = 'test2'
    return x
    },

    test2: function () {
        fetch('https://p184-geps-production-api.hd-rtls.com/objects/00000001/pos?max_age=60', {
            method: 'GET', // or 'PUT'
            headers: {
                "Accept": "application/json",
                "X-Authenticate-User": "cpal",
                "X-Authenticate-Password": "cpal"
            },

        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data.Latitude);
                var x = data.Latitude.value
                return x;
            })
            .catch((error) => {
                console.error('Error:', error);
                return error;
            });

    }




}