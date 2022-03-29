import { clockObj } from "./clock.js";
import { timerObj } from "./timer.js";
import { stopwatchObj } from "./stopwatch.js"

const clock = document.getElementById("clock");
const timer = document.getElementById("timer");
const stopwatch = document.getElementById("stopwatch");
const mainSection = document.getElementById("main-section");
const root = document.documentElement;
const toggle = document.getElementById("theme");

root.className = "light";
toggle.addEventListener("click", () => { 
    if (toggle.checked) {
        root.className = "dark";
        clockObj.enable_dark_mode(true);
        timerObj.enable_dark_mode(true);
    }
    else {
        root.className = "light";
        clockObj.enable_dark_mode(false);
        timerObj.enable_dark_mode(false);
    }
});

clock.addEventListener("click", () => {
    clockObj.switch_to_clock(mainSection);
});

timer.addEventListener("click", () => {
    clockObj.kill_clock();
    timerObj.switch_to_timer(mainSection);
});

stopwatch.addEventListener("click", () => {
    clockObj.kill_clock();
    stopwatchObj.switch_to_stopwatch(mainSection);
});

clock.click();