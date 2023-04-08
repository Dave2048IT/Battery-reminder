(function() {
  const chargingEl = document.getElementById("charging");
  const levelEl = document.getElementById("level");
  const reminderEl = document.getElementById("reminder");
  const plugInSound = new Audio('audio/water-droplets-1.wav');
  const unplugSound = new Audio('audio/matches-1.wav');

  function onBatteryStatusChange(status) {
      const isCharging = status.charging;
      const batteryLevel = Math.floor(status.level * 100);

      chargingEl.innerText = isCharging ? "Charging" : "Not Charging";
      levelEl.innerText = `${batteryLevel}%`;

      const color = [
          Math.floor(255 - (255 / 100) * batteryLevel),
          Math.floor((255 / 100) * batteryLevel),
          0
      ];


      if (isCharging && batteryLevel > 75) {
          unplugSound.play();
          reminderEl.innerText = "It's hot. Please unplug the charger.";
      } else if (!isCharging && batteryLevel < 18) {
          plugInSound.play();
          reminderEl.innerText = "I am thirsty. Please plug in the charger.";
      } else {
          reminderEl.innerText = "";
      }

      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }


  window.addEventListener("load", async function () {
      // Check for browser compatibility
      const status_api = "onbatterystatus" in navigator;
      const battery_api = "getBattery" in navigator || ("battery" in navigator && "Promise" in window);
      if (status_api)
          alert("Supports onbatterystatus");
          
      if (battery_api)
          alert("Supports getBattery")
          
      if (!status_api && !battery_api) {
          alert("Battery APIs are not supported on this browser.");
          return;
      }

      // Get initial battery status and register levelchange event listener using async/await syntax
      let battery = await navigator.getBattery();
      onBatteryStatusChange(battery);

      if (status_api) {
          // Register onbatterystatus event listener if available
          navigator.onbatterystatus = function (event) {
              onBatteryStatusChange(event.target);
          };
      } else if (battery_api) {
          // Register levelchange event listener using async/await syntax
          battery.addEventListener("levelchange", async function () {
              onBatteryStatusChange(battery);
          });
      }

      // Update battery status every 30 seconds
      setInterval(async function () {
          battery = await navigator.getBattery();
          onBatteryStatusChange(battery);
      }, 120 * 1000);
  });
})();