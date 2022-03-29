import { map, create_ul } from "./utilities.js";
 
export const timerObj = (
    () => {
        const timersContainer = document.createElement("div");
        const addTimer = document.createElement("div");
        const button = document.createElement("button");
        let timers, darkMode;

        timers = [];
        darkMode = false;

        addTimer.classList.add("add-timer");
        addTimer.append(button);

        button.addEventListener("click", () => {
            let newTimer;

            newTimer = create_timer(`Timer ${timers.length}`, 60);
            timers.push(newTimer);
            timersContainer.removeChild(addTimer);
            timersContainer.append(newTimer.markup);
            timersContainer.append(addTimer);
        });
        timersContainer.classList.add("timers");

        function switch_to_timer(container) {
            if (!timers.length)
                timers[0] = create_timer("Timer 0", 60);
            append_timers(container);
        }

        function append_timers(container) {
            container.innerHTML = '';
            for (let tim of timers)
                timersContainer.append(tim.markup);
            timersContainer.append(addTimer);
            container.append(timersContainer)
        }

        function create_timer(name, totalSeconds, running = false, resettable = false) {
            const timerDiv = document.createElement("div");
            const closeButt = document.createElement("button");
            const resetButt = document.createElement("button");
            const timerGuts = document.createElement("div");
            const progressBar = document.createElement("div");  
            const progressButt = document.createElement("button");
            const progressCanvas = document.createElement("canvas");
            const timerName = document.createElement("input");
            const timerInputs = document.createElement("div");

            const secsInHour = 3600;
            const secsInMin = 60;

            let hours, minutes, seconds;
            let context;
            let inputValues;
            let timerKiller, animeKiller, edKiller, audioKiller;
            let incButts;
            let totalRunning, timeLeft;
            let color;
            let audio;

            totalRunning = totalSeconds;
            timeLeft = totalSeconds;

            audio = new Audio("alarm_sound.mp3");

            seconds = totalSeconds;
            hours = String(Math.floor(seconds / secsInHour)).padStart(2, '0');
            seconds %= secsInHour;
            minutes = String(Math.floor(seconds / secsInMin)).padStart(2, '0');
            seconds = String(seconds % secsInMin).padStart(2, '0');

            const inputs = create_ul(3, [
                [
                    { type: "input", attributes: [{ attribute: "type", value: "tel" }, { attribute: "spellcheck", value: false }, { attribute: "value", value: hours }] },
                    { type: "span", attributes: [{ attribute: "innerText", value: ":" }] }
                ],
                [
                    { type: "input", attributes: [{ attribute: "type", value: "tel" }, { attribute: "spellcheck", value: false }, { attribute: "value", value: minutes }] },
                    { type: "span", attributes: [{ attribute: "innerText", value: ":" }] }
                ],
                [
                    { type: "input", attributes: [{ attribute: "type", value: "tel" }, { attribute: "spellcheck", value: false }, { attribute: "value", value: seconds }] },
                ]
            ]);

            const timerTimer = create_ul(3, [
                [
                    { type: "p", attributes: [{ attribute: "innerText", value: "00" }] },
                    { type: "span", attributes: [{ attribute: "innerText", value: ":" }] }
                ],
                [
                    { type: "p", attributes: [{ attribute: "innerText", value: "01" }] },
                    { type: "span", attributes: [{ attribute: "innerText", value: ":" }] }
                ],
                [
                    { type: "p", attributes: [{ attribute: "innerText", value: "00" }] },
                ]
            ]);

            const labels = create_ul(3, [
                [
                    { type: "p", attributes: [{ attribute: "innerText", value: "hour" }] }
                ],
                [
                    { type: "p", attributes: [{ attribute: "innerText", value: "min" }] }
                ],
                [
                    { type: "p", attributes: [{ attribute: "innerText", value: "sec" }] }
                ]
            ]);

            const timerIncs = create_ul(3, [
                [
                    { type: "button", attributes: [{ attribute: "innerText", value: "+10" }] },
                    { type: "p", attributes: [{ attribute: "innerText", value: "min" }] }
                ],
                [
                    { type: "button", attributes: [{ attribute: "innerText", value: "+1" }] },
                    { type: "p", attributes: [{ attribute: "innerText", value: "min" }] }
                ],
                [
                    { type: "button", attributes: [{ attribute: "innerText", value: "+15" }] },
                    { type: "p", attributes: [{ attribute: "innerText", value: "sec" }] }
                ]
            ]);

            closeButt.addEventListener("click", () => {
                const timersContainer = closeButt.parentElement.parentElement;
                const timerComponent = closeButt.parentElement;
                let index;

                index = timers.indexOf(timers.filter(tim => tim.markup == timerComponent)[0]);
                timers.splice(index, 1);
                timersContainer.removeChild(timerComponent);
                kill_many();
            });

            inputValues = [...inputs.querySelectorAll("input")];

            inputValues.forEach((input, index) => {
                input.addEventListener("input", () => {
                    if (input.value.length > 2)
                        input.value = input.value.substring(0, 2);
                    if (isNaN(Number(input.value)))
                        input.value = '00';
                });
                input.addEventListener("change", () => {
                    let maxValue, secs;

                    maxValue = index ? 59 : 99;
                    if (input.value > maxValue)
                        input.value = maxValue;
                    input.value = String(input.value).padStart(2, '0');

                    secs = 3600;
                    totalSeconds = 0;
                    for (let value of inputValues) {
                        totalSeconds += secs * value.value;
                        secs /= 60;
                    }
                });
            });

            function update(seconds) {
                const inputElements = inputs.querySelectorAll("input");
                const timeElements = timerTimer.querySelectorAll("p");

                hours = String(Math.floor(seconds / secsInHour)).padStart(2, '0');
                seconds %= secsInHour;
                minutes = String(Math.floor(seconds / secsInMin)).padStart(2, '0');
                seconds = String(seconds % secsInMin).padStart(2, '0');

                inputElements[0].value = hours;
                inputElements[1].value = minutes;
                inputElements[2].value = seconds;

                timeElements[0].innerText = hours;
                timeElements[1].innerText = minutes;
                timeElements[2].innerText = seconds;
            }

            progressButt.addEventListener("click", () => {
                if (timeLeft >= 0) {
                    progressButt.style.backgroundImage = `url(images/${running ? "play.png" : "pause.png"})`;

                    if (!resettable) {
                        update(totalSeconds);

                        resettable = true;
                        timerTimer.style.display = "flex";
                        inputs.style.display = "none";
                        timeLeft = totalSeconds;
                        totalRunning = totalSeconds;
                        color = 0;
                    }

                    if (!running) {
                        run_timer();
                        draw_progress_bar(0);
                    }
                    else {
                        clearTimeout(timerKiller);
                        cancelAnimationFrame(animeKiller);
                    }

                    running = !running;
                }
                else
                    great_reset();
            });

            function kill_many() {
                audio.pause();
                audio.currentTime = 0;
                clearTimeout(timerKiller);
                cancelAnimationFrame(animeKiller);
                cancelAnimationFrame(edKiller);
                clearTimeout(audioKiller);
            }

            function draw_progress_bar() {
                context.clearRect(0, 0, progressCanvas.width, progressCanvas.height);

                if (timeLeft >= 0) {
                    context.lineWidth = 7;
                    context.beginPath();
                    context.strokeStyle = "rgb(250, 255, 215)";
                    context.arc(progressCanvas.width / 2, progressCanvas.height / 2, 70, 0, Math.PI * 2);
                    context.stroke();
                    context.beginPath();
                    context.strokeStyle = darkMode ?  "#07254d" : "rgb(125, 175, 245)";
                    context.arc(progressCanvas.width / 2, progressCanvas.height / 2, 70, - Math.PI / 2, map(totalRunning - timeLeft, 0, totalRunning + 1, 0, Math.PI * 2) - Math.PI / 2);
                    context.stroke();
                }

                animeKiller = requestAnimationFrame(draw_progress_bar);
            }

            function anime_ed() {
                let distance, distInc;

                distance = 1;
                distInc = 3;

                context.clearRect(0, 0, progressCanvas.width, progressCanvas.height);

                context.lineWidth = 4;
                for (let i = 0; i < 35; i++, distance += distInc) {
                    context.strokeStyle = `hsl(${(i * 5 + color) % 360}, 100%, 90%)`;
                    context.beginPath();
                    context.arc(progressCanvas.width / 2, progressCanvas.height / 2, distance, 0, Math.PI * 2);
                    context.stroke();
                }
                color += 3;

                edKiller = requestAnimationFrame(anime_ed);
            }

            function play_audio() {
                audio.play();
                audioKiller = setTimeout(play_audio, 1000);
            }

            function run_timer() {
                if (timeLeft >= 0) {
                    update(timeLeft--);
                    timerKiller = setTimeout(run_timer, 1000);

                    if (timeLeft < 0) {
                        progressButt.style.backgroundImage = "url(images/check.png)";
                        progressCanvas.style.boxShadow = "0 5px 10px 3px rgb(163, 147, 147)";
                        anime_ed();
                        play_audio();
                    }
                }
                else {
                    clearTimeout(timerKiller);
                    cancelAnimationFrame(animeKiller);
                }
            }

            incButts = [...timerIncs.querySelectorAll("button")];
            incButts.forEach((button, index) => button.addEventListener("click", () => {
                if (timeLeft >= 0) {
                    let timeAdded;
                    switch (index) {
                        case 0:
                            timeAdded = 600;
                            break;
                        case 1:
                            timeAdded = 60;
                            break;
                        case 2:
                            timeAdded = 15;
                            break;
                    }
                    resettable ? (totalRunning += timeAdded) : (totalSeconds += timeAdded);
                    timeLeft += timeAdded;
                    running ? update(timeLeft) : update(totalSeconds);
                }
            }));

            resetButt.addEventListener("click", great_reset);

            function great_reset() {
                resettable = false;
                running = false;
                timerTimer.style.display = "none";
                inputs.style.display = "flex";

                timeLeft = totalSeconds;
                totalRunning = totalSeconds;
                update(totalSeconds);
                kill_many();
                context.lineWidth = 7;
                progressCanvas.style.boxShadow = "none";
                progressButt.style.backgroundImage = "url(images/play.png)";

                context.clearRect(0, 0, progressCanvas.width, progressCanvas.height);
                context.beginPath();
                context.strokeStyle = "rgb(250, 255, 215)";
                context.arc(progressCanvas.width / 2, progressCanvas.height / 2, 70, 0, Math.PI * 2);
                context.stroke();

            }

            timerDiv.classList.add("timer");
            closeButt.classList.add("close");
            resetButt.classList.add("reset");
            timerGuts.classList.add("timer-guts");

            progressBar.classList.add("progress-bar");
            progressCanvas.width = 150;
            progressCanvas.height = 150;
            context = progressCanvas.getContext("2d");
            context.lineWidth = 7;
            context.beginPath();
            context.strokeStyle = "rgb(250, 255, 215)";
            context.arc(progressCanvas.width / 2, progressCanvas.height / 2, 70, 0, Math.PI * 2);
            context.stroke();

            timerName.classList.add("timer-name");
            timerName.type = "text";
            timerName.value = name;

            timerInputs.classList.add("timer-inputs");
            inputs.classList.add("inputs");
            timerTimer.classList.add("timer-timer");
            timerTimer.style.display = "none";
            labels.classList.add("labels");

            timerIncs.classList.add("timer-increments");

            timerInputs.append(inputs);
            timerInputs.append(timerTimer);
            timerInputs.append(labels);

            progressBar.append(progressButt);
            progressBar.append(progressCanvas);

            timerGuts.append(progressBar);
            timerGuts.append(timerName);
            timerGuts.append(timerInputs);
            timerGuts.append(timerIncs);

            timerDiv.append(closeButt);
            timerDiv.append(resetButt);
            timerDiv.append(timerGuts);

            return { markup: timerDiv };
        }

        function enable_dark_mode(dark) {
            darkMode = dark;
        }

        return { switch_to_timer, enable_dark_mode };
    }
)();