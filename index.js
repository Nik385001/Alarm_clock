const currentTime = document.querySelector("#clock h1");
const content = document.querySelector(".content");
const selectMenu = document.querySelectorAll(".content select");
const stopAlarmBtn = document.getElementById("clearAlarmButton");
const myList = document.getElementById("myList");
const ringtone = new Audio("./files/ringtone.mp3");

let alarms = [];
let currentRingingAlarm = null;

for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

setInterval(() => {
    let date = new Date(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ampm = "AM";
    
    if (h >= 12) {
        h = h - 12;
        ampm = "PM";
    }
    
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

    // Check if any alarms match the current time
    alarms.forEach(alarm => {
        if (alarm.time === `${h}:${m} ${ampm}` && !alarm.isRinging) {
            alarm.isRinging = true;
            currentRingingAlarm = alarm;
            ringtone.play();
            ringtone.loop = true;
        }
    });
}, 1000);

function setAlarm() {
    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please, select a valid time to set Alarm!");
    }

    alarms.push({
        time: time,
        isRinging: false
        
    });

    

    // Display the newly added alarm in the list
    const newAlarmItem = document.createElement("li");
    newAlarmItem.textContent = time;

    // Add a delete button for each alarm
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteAlarm(time);
    };

    newAlarmItem.appendChild(deleteButton);
    myList.appendChild(newAlarmItem);
}

function deleteAlarm(time) {
    // Find the index of the alarm with the given time
    const index = alarms.findIndex(alarm => alarm.time === time);

    // Remove the alarm from the array
    alarms.splice(index, 1);

    // Remove the corresponding list item from the UI
    const listItem = Array.from(myList.children).find(item => item.textContent.includes(time));
    if (listItem) {
        myList.removeChild(listItem);
    }
}

// Event listener for setting alarms
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("button").addEventListener("click", setAlarm);
});

// Event listener for stopping alarms
stopAlarmBtn.addEventListener("click", function() {
    if (currentRingingAlarm) {
        currentRingingAlarm.isRinging = false;
        ringtone.pause();
        currentRingingAlarm = null;
    }
});
