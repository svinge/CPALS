const headers = {
    "Accept": "application/json",
    "X-Authenticate-User": "cpal",
    "X-Authenticate-Password": "cpal"
}

const URL = 'https://p184-geps-production-api.hd-rtls.com/'


 function test3() {
    var output_data = '';
     return fetch('https://p184-geps-production-api.hd-rtls.com/objects/00000001/pos?max_age=60', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "X-Authenticate-User": "cpal",
            "X-Authenticate-Password": "cpal"
        }

    })
        .then(response => response.json())
        .then(data => {
            output_data = data;
            // console.log('Success:', output_data);            
            return data;
        })
        .catch((error) => {
            output_data = error;
            // console.error('Error:', error);
            return error;

        })
        
    


}

