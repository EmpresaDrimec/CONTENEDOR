var clientId = "ws" + Math.random();
var client = new Paho.MQTT.Client("192.168.0.16", 9001, clientId); // Conectar a Mosquitto

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({
    onSuccess: onConnect,
    onFailure: onFailure,
    useSSL: false
});

function onConnect() {
    console.log("Conectado a Mosquitto WebSocket MQTT");

    // Suscribirse a los tópicos para cada contenedor
    let topics = [
        "container1/temperature", "container1/humidity", "container1/fire", "container1/volume", "container1/latitude", "container1/longitude",
        "container2/temperature", "container2/humidity", "container2/fire", "container2/volume", "container2/latitude", "container2/longitude",
        "container3/temperature", "container3/humidity", "container3/fire", "container3/volume", "container3/latitude", "container3/longitude"
    ];

    topics.forEach(topic => client.subscribe(topic));
}

function onFailure(responseObject) {
    console.error("Fallo en la conexión: " + responseObject.errorMessage);
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("Conexión perdida: " + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    let topic = message.destinationName;
    let payload = message.payloadString;
    
    try {
        let data = JSON.parse(payload);
        let container = topic.split('/')[0]; // Obtiene el contenedor del tópico
        let sensor = topic.split('/')[1]; // Obtiene el sensor del tópico

        // Actualizar los datos del contenedor correspondiente
        updateValue(container, sensor, data);
    } catch (e) {
        console.error("Error al analizar el mensaje JSON: " + e.message);
    }
}

function updateValue(containerId, sensor, value) {
    switch (sensor) {
        case "temperature":
            document.getElementById(`temperatureValue${containerId.slice(-1)}`).textContent = value !== undefined ? value + "°C" : "No disponible";
            updateProgressBar(`temperatureBar${containerId.slice(-1)}`, value, -10, 50);
            break;
        case "humidity":
            document.getElementById(`humidityValue${containerId.slice(-1)}`).textContent = value !== undefined ? value + "%" : "No disponible";
            updateProgressBar(`humidityBar${containerId.slice(-1)}`, value, 0, 100);
            break;
        case "fire":
            document.getElementById(`fireStatus${containerId.slice(-1)}`).textContent = value === 1 ? "¡Fuego Detectado!" : "No detectado";
            break;
        case "volume":
            document.getElementById(`volumeValue${containerId.slice(-1)}`).textContent = value !== undefined ? value + "%" : "No disponible";
            updateProgressBar(`volumeBar${containerId.slice(-1)}`, value, 0, 100);
            break;
        case "latitude":
            document.getElementById(`latitudeValue${containerId.slice(-1)}`).textContent = value !== undefined ? value : "No disponible";
            break;
        case "longitude":
            document.getElementById(`longitudeValue${containerId.slice(-1)}`).textContent = value !== undefined ? value : "No disponible";
            break;
        default:
            console.error("Sensor desconocido: " + sensor);
    }
}

function updateProgressBar(barId, value, min, max) {
    let progress = document.getElementById(barId);
    if (progress) {
        let percentage = ((value - min) / (max - min)) * 100;
        progress.style.width = percentage + "%";
    }
}
