window.onload = function() {
    this.searchWebSocket = null;
    this.logsWebSocket = null;
    this.devicesColors = {};

    searchDevices();
    loadInfo();
    hideButton("logs-disconnect");
}
window.addEventListener('beforeunload', function (e) {
    if (this.searchWebSocket != null) {
        this.searchWebSocket.close();
    }
    if (this.logsWebSocket != null) {
        this.logsWebSocket.close();
    }
});

async function loadInfo() {
    restRequest(
        "GET",
        "/st/info",
        null,
        function(response) {
            if (response) {
                const info = JSON.parse(response);
                const parent = document.getElementById("server-info");
                parent.innerHTML = "";
                Object.entries(info).forEach(([key, value]) => {
                    const div = document.createElement("div");
                    div.innerHTML = key + ": " + value;
                    parent.appendChild(div);
                });
            }
        }
    );
}

async function searchDevices() {
    document.getElementById("devices-list").innerHTML = "";
    this.searchWebSocket = connectToWs (
        "/find", 
        (event) => {
            if (!this.devices) {
                this.devices = {};
            }
            if (event.data) {
                const data = String(event.data).split(":");
                if (!(data[0] in this.devices)) {
                    console.log("Got new device " + data);
                    this.devices[data[0]] = data;
                    this.devicesColors[data[0]] = generateColorByIp(data[0]);
                    const item = document.createElement("li");
                    const div = document.createElement("div");
                    div.className = "device-name";
                    div.style.backgroundColor = this.devicesColors[data[0]];
                    div.innerHTML = "[" + data[0] + "] " + data[1];
                    div.title = "Open device page";
                    div.onclick = () => {
                        console.log(data[0]);
                        window.open("http://" + data[0], '_blank').focus();
                    };
                    item.id = data[0];
                    item.appendChild(div);
                    loadDeviceInfo(data[0]);
                    document.getElementById("devices-list").appendChild(item);
                }
            } else {
                console.warn("Empty ws message");
            }
        }
    );
    console.log("Web socket connected (find)");
}

async function connectToLogger() {
    this.logsWebSocket = connectToWs (
        "/logs",
        (event) => {
            if (event.data) {
                console.log(event.data);
                const ip = extractIpFromLogMessage(event.data);
                const div = document.createElement("div");
                div.innerHTML = event.data;
                div.style.backgroundColor = this.devicesColors[ip];
                div.className = ip;
                document.getElementById("devices-logs").prepend(div);
            }
        }
    );
    console.log("Web socket connected (logs)");
    hideButton("logs-connect");
    showButton("logs-disconnect");
}

async function diconnectFromLogger() {
    if (this.logsWebSocket != null) {
        this.logsWebSocket.close();
        hideButton("logs-disconnect");
        showButton("logs-connect");
    } else {
        console.log("Logs socket already closed");
    }
}

async function loadDeviceInfo(deviceIp) {
    if (!deviceIp) {
        return;
    }
    restRequest(
        "GET",
        "/info",
        null,
        function (response) {
            if (response) {
                const element = document.getElementById(deviceIp);
                if (element) {
                    const infoList = document.createElement("ul");
                    const info = JSON.parse(response);
                    Object.entries(info).forEach(([key, value]) => {
                        const li = document.createElement("li");
                        li.id = key;
                        li.innerHTML = key + ": " + value;
                        infoList.appendChild(li);
                    });
                    element.appendChild(infoList);
                }
            }
        },
        deviceIp
    );
}

function connectToWs(path, callback) {
    const wsUrl = "ws://" + getHost() + "/ws" + path;
    console.log("Ws connecting to " + wsUrl);
    const socket = new WebSocket(wsUrl);
    socket.onmessage = (event) => callback(event);
    socket.onerror = (event) => {
        console.error(wsUrl, event);
    };
    socket.onclose = () => {
        console.warn("web socket " + wsUrl + " closed");
    };
    return socket;
}

function restRequest(method, path, data, callback, host) {
    if (!path) {
        console.error("Empty path!");
        return;
    }
    let xhr = new XMLHttpRequest();
    if (!host) {
        host = getHost();
    }
    xhr.open(method, "http://" + host + path);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    if (callback) callback(xhr.response);
                } else {
                    console.error("Request " + host + path + " failed with code " + xhr.status1);
                }
            }
        };
    xhr.send(data ? JSON.stringify(data) : null);
}

function showButton(buttonId) {
    document.getElementById(buttonId).style.display = "";
}
function hideButton(buttonId) {
    document.getElementById(buttonId).style.display = "none";
}

function getHost() {
    const { host } = window.location;
    return host;
}


function generateColorByIp(ip) {
    const splited = ip.split(".");
    const r = chooseRandom(splited, 100, 200);
    const g = chooseRandom(splited, 100, 200);
    const b = chooseRandom(splited, 100, 200);
    return 'rgb(' + r + ',' + g + ',' + b + ')'
}

function chooseRandom(arr, min, max) {
    const val = arr[Math.floor(Math.random() * arr.length)];
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    }
    return val;
}

function extractIpFromLogMessage(message) {
    return message.substr(message.indexOf('{') + 1, message.indexOf('}') - 1)
}