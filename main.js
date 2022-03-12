const clock = document.getElementById("clock-butt");
const timer = document.getElementById("timer-butt");
const stopwatch = document.getElementById("stopwatch-butt");
const mainSection = document.getElementById("main-section");


function map(value, start1, end1, start2, end2) {
    return start2 + (end2 - start2) * (value - start1) / (end1 - start1);
}

function create_ul(items, content) {
    const ul = document.createElement("ul");

    for (let i = 0; i < items; i++) {
        const li = document.createElement("li");

        for (let element of content[i]) {
            const htmlElem = document.createElement(element.type);

            for (let attribute of element.attributes) {
                htmlElem[attribute.attribute] = attribute.value;
            }
            li.append(htmlElem)
        }
        ul.append(li)
    }
    return ul;
}

let stopwatchObj = (
    () => {
        const watchContainer = document.createElement("div");
        const digitsContainer = document.createElement("div");
        const digits = document.createElement("p");
        const subs = document.createElement("sub");
        const lapsContainer = document.createElement("div");
        const laps = document.createElement("ul");
        const buttsContainer = document.createElement("div");

        const ulButts = create_ul(3, [
            [
                { type: "button", attributes: [{ attribute: "id", value: "watch-start" }] }
            ],
            [
                { type: "button", attributes: [{ attribute: "id", value: "watch-lap" }] }
            ],
            [
                { type: "button", attributes: [{ attribute: "id", value: "watch-reset" }] }
            ]
        ]);
        const buttons = ulButts.querySelectorAll("button");
        let running, watchKiller, totalCents;
        let totalLaps, lapTime;

        lapsContainer.append(laps);
        buttsContainer.append(ulButts);
        digitsContainer.append(digits);
        digitsContainer.append(subs);
        watchContainer.append(digitsContainer);
        watchContainer.append(buttsContainer);
        watchContainer.append(lapsContainer);

        digits.innerText = "00:00:00";
        subs.innerText = "00"

        watchContainer.classList.add("watch-container");
        digitsContainer.classList.add("watch-digits");
        buttsContainer.classList.add("watch-buttons");
        lapsContainer.classList.add("watch-laps");

        buttons[0].addEventListener("click", () => {
            if (running) {
                buttons[0].id = "paused";
                clearTimeout(watchKiller);
            }
            else {
                buttons[0].id = "playing";
                run_stopwatch();
            }

            running = !running;
        });

        buttons[1].addEventListener("click", () => {
            if (running) {
                const lapItem = document.createElement("li");
                const lapOrder = document.createElement("span");
                const lapLength = document.createElement("span");
                const lapLengthSubs = document.createElement("sub");
                const lapDuration = document.createElement("span");
                const lapDurationSubs = document.createElement("sub");
                let hours, minutes, seconds, centiseconds;
                
                ({ hours, minutes, seconds, centiseconds } = compute_values(totalCents));
                lapOrder.innerText = `#${++totalLaps}`;
                lapLength.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                lapLengthSubs.innerText = String(centiseconds).padStart(2, '0');

                ({ hours, minutes, seconds, centiseconds } = compute_values(lapTime));
                lapDuration.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                lapDurationSubs.innerText = String(centiseconds).padStart(2, '0');

                lapItem.append(lapOrder);
                lapItem.append(lapLength);
                lapLength.append(lapLengthSubs);
                lapItem.append(lapDuration);
                lapDuration.append(lapDurationSubs);
                laps.prepend(lapItem);

                lapTime = 0;
            }
        });

        buttons[2].addEventListener("click", () => {
            clearTimeout(watchKiller);
            totalCents = 0;
            digits.innerText = "00:00:00";
            subs.innerText = "00";
            buttons[0].id = "paused";
            running = false;
            laps.innerHTML = '';
            totalLaps = 0;
            lapTime = 0;
        });

        function compute_values(centiseconds) {
            const centsPerHour = 360000;
            const centsPerMin = 6000;
            const centsPerSec = 100;
            let hours, minutes, seconds;

            hours = Math.floor(centiseconds / centsPerHour);
            centiseconds %= centsPerHour;
            minutes = Math.floor(centiseconds / centsPerMin);
            centiseconds %= centsPerMin;
            seconds = Math.floor(centiseconds / centsPerSec);
            centiseconds %= centsPerSec;
            return { hours, minutes, seconds, centiseconds };            
        }
        
        function run_stopwatch() {
            let hours, minutes, seconds, centiseconds;
            
            ({ hours, minutes, seconds, centiseconds } = compute_values(totalCents));
            digits.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            subs.innerText = String(centiseconds).padStart(2, '0');

            totalCents++;
            lapTime++;

            watchKiller = setTimeout(run_stopwatch, 10);
        }

        function append_watch() {
            mainSection.innerHTML = '';
            mainSection.append(watchContainer);
        }

        function switch_to_stopwatch() {
            append_watch();
        }

        function init() {
            running = false;
            buttons[0].id = "paused";
            totalCents = 0;
            lapTime = 0;
            totalLaps = 0;
        }

        init();

        return { switch_to_stopwatch };
    }
)();

stopwatch.addEventListener("click", () => {
    clockObj.kill_clock();
    stopwatchObj.switch_to_stopwatch();
});

//---------------------------------------------------

/**
 * fix the progress bar bug
 */

let timerObj = (
    () => {
        const timersContainer = document.createElement("div");
        const addTimer = document.createElement("div");
        const button = document.createElement("button");
        let timers

        timers = [];

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

        function switch_to_timer() {
            if (!timers.length)
                timers[0] = create_timer("Timer 0", 60);
            append_timers();
        }

        function append_timers() {
            mainSection.innerHTML = '';
            for (let tim of timers)
                timersContainer.append(tim.markup);
            timersContainer.append(addTimer);
            mainSection.append(timersContainer)
        }

        function create_timer(name, totalSeconds, running = false, resettable = false, timeLeft = totalSeconds) {
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
            let totalRunning;
            let angle, angleInc;
            let color;
            let audio;

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

            timerName.addEventListener("change", () => {
                name = timerName.value;
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
                        angle = 0;
                        angleInc = Math.PI * 2 / (totalSeconds * 60);
                        dt = 0;
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
                    context.strokeStyle = "rgb(125, 175, 245)";
                    context.arc(progressCanvas.width / 2, progressCanvas.height / 2, 70, - Math.PI / 2, angle - Math.PI / 2);
                    context.stroke();
                    angle += angleInc;
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
                    angle = 2 * Math.PI * (totalRunning - timeLeft) / (totalRunning + timeAdded);
                    angleInc = Math.PI * 2 / ((totalRunning + timeAdded) * 60);
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

        return { switch_to_timer };
    }
)();

timer.addEventListener("click", () => {
    clockObj.kill_clock();
    timerObj.switch_to_timer();
});

//---------------------------------------------------

let clockObj = (
    () => {
        const quoteBox = document.createElement("div");
        const quoteContainer = document.createElement("div");
        const quote = document.createElement("h2");
        const quoteLink = document.createElement("a");
        const getAnother = document.createElement("button");

        const timeWarper = document.createElement("div");
        const time = document.createElement("div");
        const day = document.createElement("div");

        const divButts = document.createElement("div");
        const appearButt = document.createElement("button");
        const formatButt = document.createElement("button");

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const hand = document.createElement("img");
        const minWidth = 500;

        let clockKiller, basedFormat, analog;

        getAnother.classList.add("change-quote");
        quoteBox.classList.add("quote-box");
        quoteContainer.classList.add("quote-container");
        quoteLink.target = "_blank";

        quoteBox.append(quote);
        quoteBox.append(quoteLink);
        quoteContainer.append(quoteBox);
        quoteContainer.append(getAnother);
        getAnother.addEventListener("click", get_quote);

        time.classList.add("time");
        day.classList.add("day");
        timeWarper.classList.add("time-warper");
        timeWarper.append(time);
        timeWarper.append(day);
        timeWarper.append(divButts);

        divButts.classList.add("butts-container");
        appearButt.classList.add("toggle-analog-digital");
        formatButt.classList.add("toggle-hour-format");
        appearButt.innerText = "Toggle Analog";
        formatButt.innerText = "12 hour format";
        divButts.append(appearButt);
        divButts.append(formatButt);

        hand.src = "images/hand.png";
        basedFormat = true;
        analog = false;

        formatButt.addEventListener("click", () => {
            basedFormat = !basedFormat;
            formatButt.innerText = `${basedFormat ? 12 : 24} hour format`;
        });

        get_quote();

        function get_quote() {
            const iconCanvas = document.createElement("canvas");
            const iconContext = iconCanvas.getContext("2d");
            const subs = ["todayilearned", "showerthoughts", "lifeprotips"];
            const intervals = ["month", "year", "all"];
            let sub, interval, animeKiller, dt, color;

            dt = 0;
            color = 0;
            iconCanvas.width = 115;
            iconCanvas.height = 115;
            quote.innerHTML = '';
            quote.append(iconCanvas);
            quoteLink.innerText = '';

            function loading_icon() {
                let circles, distance, angle, angleInc, minRad, maxRad;

                circles = 20;
                distance = 45;
                angle = 0;
                angleInc = Math.PI * 2 / circles;
                minRad = 1;
                maxRad = 6;

                iconContext.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < circles; i++, angle += angleInc) {
                    let radius;

                    radius = minRad + Math.abs(maxRad * Math.sin(map(dt % circles, 0, circles, 0, Math.PI * 2) + i * Math.PI * 3 / circles));
                    iconContext.beginPath();
                    iconContext.fillStyle = `hsl(${(i * 10 + color) % 360}, 100%, 50%)`;
                    iconContext.arc(distance * Math.cos(angle) + iconCanvas.width / 2, distance * Math.sin(angle) + iconCanvas.height / 2, radius, 0, Math.PI * 2);
                    iconContext.fill();
                }
                color += 1;
                dt += .1;

                animeKiller = requestAnimationFrame(loading_icon);
            }

            loading_icon();

            sub = subs[Math.floor(Math.random() * subs.length)];
            interval = intervals[Math.floor(Math.random() * intervals.length)];
            fetch(
                `https://www.reddit.com/r/${sub}/top.json?t=${interval}&limit=100`,
                { method: "GET" }).then(res => res.json()).then(response => {
                    let child;

                    cancelAnimationFrame(animeKiller);
                    quote.innerHTML = '';

                    do {
                        child = response.data.children[Math.floor(Math.random() * response.data.children.length)];
                    } while (child.data.title.length > 200 && window.innerWidth < minWidth);
                    quote.innerHTML = child.data.title;  //...
                    quoteLink.innerText = sub == "todayilearned" ? "read more" : ` by u/${child.data.author} on reddit`;
                    quoteLink.href = child.data.url;
                });
        }

        if (window.innerWidth < minWidth) {
            canvas.width = .9 * window.innerWidth;
            canvas.height = window.innerWidth;
        }
        else {
            canvas.width = minWidth;
            canvas.height = minWidth;
        }

        appearButt.addEventListener("click", () => {
            kill_clock();
            time.innerHTML = '';

            if (analog) {
                appearButt.innerText = "Toggle Analog";
                formatButt.style.display = "inline";
                run_digital_clock();
            }
            else {
                appearButt.innerText = "Toggle Digital";
                formatButt.style.display = "none";
                run_analog_clock();
            }

            analog = !analog;
        });

        function anime() {
            let angle, angleInc, offsetX, offsetY, distance;

            context.clearRect(0, 0, canvas.width, canvas.height);

            context.lineWidth = 7;
            context.strokeStyle = "purple";
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, .49 * canvas.width, 0, Math.PI * 2);
            context.stroke();

            angleInc = Math.PI / 6;
            angle = - Math.PI / 3;
            offsetX = -.025 * canvas.width;
            offsetY = .03 * canvas.width;
            distance = .425 * canvas.width;
            context.fillStyle = "red";
            context.font = `${.08 * canvas.width}px monospace`;
            for (let i = 1; i <= 12; i++, angle += angleInc)
                context.fillText(i, distance * Math.cos(angle) + canvas.width / 2 + offsetX, distance * Math.sin(angle) + canvas.height / 2 + offsetY);

            if (hand.naturalWidth) {
                let date;

                date = new Date();
                draw_arrow(canvas, hand, 150, .25 * canvas.width, map(date.getHours() % 12, 0, 12, 0, Math.PI * 2) - Math.PI);
                draw_arrow(canvas, hand, 100, .35 * canvas.width, map(date.getMinutes(), 0, 60, 0, Math.PI * 2) - Math.PI);
                draw_arrow(canvas, hand, 75, .45 * canvas.width, map(date.getSeconds(), 0, 60, 0, Math.PI * 2) - Math.PI);
            }

            context.fillStyle = "purple";
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.fillStyle = "skyblue";
            context.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
            context.fill();

            clockKiller = setTimeout(anime, 1000);
        }

        function run_analog_clock() {
            time.append(canvas);
            anime();
        }

        function append_clock() {
            mainSection.innerHTML = '';
            mainSection.append(quoteContainer);
            mainSection.append(timeWarper);
        }

        function kill_clock() {
            clearTimeout(clockKiller);
        }

        function run_digital_clock() {
            const date = new Date();
            let hours, minutes, seconds;

            hours = String(date.getHours() % (basedFormat ? 24 : 12 + (date.getHours() == 12 ? 1 : 0))).padStart(2, '0');
            minutes = String(date.getMinutes()).padStart(2, '0');
            seconds = String(date.getSeconds()).padStart(2, '0');
            time.innerText = `${hours}:${minutes}:${seconds} ${basedFormat ? '' : date.getHours() < 12 ? " AM" : " PM"}`;
            day.innerText = new Date().toDateString();
            clockKiller = setTimeout(run_digital_clock, 1000);
        }

        function draw_arrow(canvas, arrow, width, height, angle) {
            let context;

            context = canvas.getContext("2d");
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(angle);
            context.drawImage(arrow, - width / 2, 0, width, height);
            context.restore();
        }

        function switch_to_clock() {
            kill_clock();
            time.innerHTML = '';
            append_clock();
            if (analog)
                run_analog_clock();
            else
                run_digital_clock();
        }

        return { switch_to_clock, kill_clock };
    }
)();

clockObj.switch_to_clock();

clock.addEventListener("click", () => {
    clockObj.switch_to_clock();
});