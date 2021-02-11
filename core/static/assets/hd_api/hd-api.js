


const headers = {
    "Accept": "application/json",
        "X-Authenticate-User": "cpal",
            "X-Authenticate-Password": "cpal"
}

const URL = 'https://p184-geps-production-api.hd-rtls.com/'


function get_pos(){
    fetch(URL + "/position", {
        method: 'GET',
        header: headers,
        })
    .then(response => response.json())
    .then(data => {
            return data
        })
    .catch((error) => {
        console.error('Error:', error);
    })}

}



              

                    function myFunction(value) {
                        text += "<li>" + "Longitude: " + value.Longitude + " Latitude: " + value.Latitude + "</li>";
                    }
      