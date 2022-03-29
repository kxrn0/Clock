import { create_ul } from "./utilities.js" 

export const stopwatchObj = (
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
        let running, watchKiller;
        let totalLaps, startTime;
        let totalTime, startLap, lapTime;

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

        running = false;
        buttons[0].id = "paused";
        totalLaps = 0;
        totalTime = 0;
        lapTime = 0;

        buttons[0].addEventListener("click", () => {
            if (running) {
                buttons[0].id = "paused";
                clearTimeout(watchKiller);
                totalTime = Math.floor((new Date().valueOf() + 10 * totalTime - startTime.valueOf()) / 10);
                lapTime = Math.floor((new Date().valueOf() + lapTime * 10 - startLap.valueOf()) / 10);
            }
            else {
                buttons[0].id = "playing";
                startTime = new Date();
                startLap = new Date();
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
                
                ({ hours, minutes, seconds, centiseconds } = compute_values(Math.floor((new Date().valueOf() + totalTime * 10 - startTime.valueOf()) / 10)));
                lapOrder.innerText = `#${++totalLaps}`;
                lapLength.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                lapLengthSubs.innerText = String(centiseconds).padStart(2, '0');

                ({ hours, minutes, seconds, centiseconds } = compute_values(Math.floor((new Date().valueOf() + lapTime * 10 - startLap.valueOf()) / 10)));
                lapDuration.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                lapDurationSubs.innerText = String(centiseconds).padStart(2, '0');

                lapItem.append(lapOrder);
                lapItem.append(lapLength);
                lapLength.append(lapLengthSubs);
                lapItem.append(lapDuration);
                lapDuration.append(lapDurationSubs);
                laps.prepend(lapItem);

                startLap = new Date();
                lapTime = 0;
            }
        });

        buttons[2].addEventListener("click", () => {
            clearTimeout(watchKiller);
            digits.innerText = "00:00:00";
            subs.innerText = "00";
            buttons[0].id = "paused";
            running = false;
            laps.innerHTML = '';
            totalLaps = 0;
            totalTime = 0;
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

            ({ hours, minutes, seconds, centiseconds } = compute_values(Math.floor((new Date().valueOf() + totalTime * 10 - startTime.valueOf()) / 10)));
            digits.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            subs.innerText = String(centiseconds).padStart(2, '0');

            watchKiller = setTimeout(run_stopwatch, 10);
        }

        function append_watch(container) {
            container.innerHTML = '';
            container.append(watchContainer);
        }

        function switch_to_stopwatch(container) {
            append_watch(container);
        }

        return { switch_to_stopwatch };
    }
)();