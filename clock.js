
import { map } from "./utilities.js";

export const clockObj = (
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

        let clockKiller, basedFormat, analog, darkMode;

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
        darkMode = false;

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

            if (darkMode) {
                context.fillStyle = "#1375c8";
                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, .5 * canvas.width, 0, Math.PI * 2);
                context.fill();
            }

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
            context.fillStyle =  darkMode? "azure" : "red";
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

        function append_clock(container) {
            container.innerHTML = '';
            container.append(quoteContainer);
            container.append(timeWarper);
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

        function switch_to_clock(container) {
            kill_clock();
            time.innerHTML = '';
            append_clock(container);
            if (analog)
                run_analog_clock();
            else
                run_digital_clock();
        }

        function enable_dark_mode(dark) {
            darkMode = dark;
        }

        return { switch_to_clock, kill_clock, enable_dark_mode };
    }
)();