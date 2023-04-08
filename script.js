(function() {
    const plugInSound = new Audio('water-droplets-1.wav');
    const unplugSound = new Audio('matches-1.wav');
  
    function updateBatteryInfo() {
      navigator.getBattery().then(battery => {
        const chargingEl = document.getElementById("charging");
        const levelEl = document.getElementById("level");
        const reminderEl = document.getElementById("reminder");
        
        chargingEl.textContent = battery.charging ? "Charging" : "Not Charging";
        levelEl.textContent = `${Math.floor(battery.level * 100)} %`;
        
        if (battery.charging && battery.level > 0.75) {
          unplugSound.play();
          document.body.style.backgroundColor = "darkgoldenrod";
          reminderEl.textContent = "It's hot. Please unplug the charger.";
        }
        else if (!battery.charging && battery.level < 0.18) {
          plugInSound.play();
          document.body.style.backgroundColor = "darkblue";
          reminderEl.textContent = "I am thirsty. Please plug in the charger.";
        }
        else {
          reminderEl.textContent = "";
          document.body.style.backgroundColor = "black";
        }
      });
    }
  
    updateBatteryInfo();
    setInterval(updateBatteryInfo, 30000);
})();
