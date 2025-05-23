const ipBox = document.querySelector('.ip-box')
const locationBox = document.querySelector('.location-box')
const timeZoneBox = document.querySelector('.time-zone-box')
const ispBox = document.querySelector('.isp-box')
const inputField = document.querySelector("#search-box-input")
const searchButton = document.querySelector(".search-btn")
let map
//gets the ip objecct 
async function ipTracker(manualIp="") {
        try {
            let url = manualIp ? `https://ipinfo.io/${manualIp}/json?token=3cf15c6238bcfd`:  'https://ipinfo.io/json?token=3cf15c6238bcfd'
            let res = await fetch(url)
            let data = await res.json()
            return data
        } catch (error) {
            alert("erorr : ",error)
        }
    }
  


// puts each key of the object to its designed field in the DOM
async function ipExtractor(manualIp="") {
    try {

        //updating the dom
        let locationObj = await ipTracker(manualIp)
        console.log(locationObj)
        ipBox.textContent = locationObj.ip
        locationBox.textContent = locationObj.region
        timeZoneBox.textContent = locationObj.timezone
        ispBox.textContent = locationObj.org
        //getting coordinates from the object
        let coordinatesArray = (locationObj.loc).split(',')
        return coordinatesArray
    } catch (error) {
        alert("erorr : ",error)
    }
}


// sets up the map in the dom 
async function main(manualIp="") {
    let coordinatesArray = await ipExtractor(manualIp)
     
    //initializing the map and setting its coordiants

    if(!map){
        map=L.map('map').setView(coordinatesArray,13)
    } else{
        //if the map is already defined so we just gonna update the coordinates 
        map.setView(coordinatesArray, 13);
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    // Load and display the tile layer from OpenStreetMap (free map data)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a marker to the map at your coordinates
    var marker = L.marker(coordinatesArray).addTo(map);
  

}
///

main()

searchButton.addEventListener('click', () => {
    const manualIp = inputField.value.trim()
    if(manualIp){
        main(manualIp)
    }
    else{
        alert("enter a valid ip address ")
    }
})












// script flow as below :
// // main() --> ipExtractor() --> ipTracker()