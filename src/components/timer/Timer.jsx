import React, { useEffect, useRef, useState } from "react";
import './timer.css';

// type TimerProps = {
//     limit: number;
// }

const Timer = (props) => {
    const {limit, isDemonstration, onTimerStart, onTimerEnd} = props;
    // const limit = 30;
    const width = useRef(isDemonstration ? 200 : 100);
    const height = useRef(isDemonstration ? 200 : 100);
    const arcWidth = useRef(isDemonstration ? 40 : 20);
    const pulseBorder = useRef(isDemonstration ? 10 : 5);
    let timePassed = 0;

    const root = document.querySelector(':root');
    const [isPause, setPause] = useState(false);
    const pauseRef = useRef(true);
    const limitRef = useRef(limit > 0 ? limit : 1);
    const timerIdRef = useRef(0);

    const usePreviousLimit = (value) => {
        const prevLimitRef = useRef(value);
          useEffect(() => {
              prevLimitRef.current = value;
          });
          return prevLimitRef.current
    };

    useEffect(() => {
        if (isPause) {
            onTimerStart();
        }
    }, [isPause])

    const limitPrev = usePreviousLimit(limit);

    const scriptLoaded = () => {
        if (!window.d3 || !window.d3.svg) return;
        const fields = [{
            value: limitRef.current,
            size: limitRef.current,
            update: function() {
                return timePassed = timePassed + 1;
            }
        }];

        let nilArc = window.d3?.svg.arc()
            .innerRadius(width.current / 3 - 133)
            .outerRadius(width.current / 3 - 133)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        let arc = window.d3?.svg.arc()
            .innerRadius(width.current / 2 - arcWidth.current)
            .outerRadius(width.current / 2)
            .startAngle(0)
            .endAngle(function(d) {
              return ((d.value / d.size) * 2 * Math.PI);
            });

        let svg = window.d3?.select(".timer").append("svg")
            .attr("width", width.current)
            .attr("height", height.current);

        let field = svg?.selectAll(".field")
            .data(fields)
            .enter().append("g")
            .attr("transform", "translate(" + width.current / 2 + "," + height.current / 2 + ")")
            .attr("class", "field");

        let back = field?.append("path")
            .attr("class", "path path--background")
            .attr("d", arc);

        let path = field?.append("path")
            .attr("class", "path path--foreground");

        let label = field?.append("text")
            .attr("class", "label")
            .attr("dy", ".35em");

        function getColor(value) {
            //value from 0 to 1
            var hue = ((1 - value) * 120).toString(10);
            return ["hsl(", hue, ",100%,50%)"].join("");
        }

        (function update() {
            try {
            if (pauseRef.current) {
                label?.text(function(d) {
                    return d.size - d.value || limitRef.current;
                });
                if (timePassed <= limitRef.current)
                    timerIdRef.current = window.setTimeout(update, 1000);
                return;
            }

            root?.style.setProperty('--timer-color', getColor(timePassed < limitRef.current / 2 ?  0 : timePassed / limitRef.current / 2));
            field
                ?.each(function(d) {
                    d.previous = d.value;
                    d.value = d.update(timePassed);
                });

            path?.transition()
                .ease("elastic")
                .duration(500)
                .attrTween("d", arcTween);

            if ((limitRef.current - timePassed) <= pulseBorder.current)
                pulseText();
            else
                label
                .text(function(d) {
                    return d.size - d.value;
                });

            if (timePassed <= limitRef.current )
                timerIdRef.current = window.setTimeout(update, 1000 - (timePassed % 1000));
            else {
                destroyTimer();
                setTimeout(() => {
                    onTimerEnd();
                }, 1000);
                setTimeout(() => {
                    onTimerEnd();
                    timePassed = 0;
                    pauseRef.current = true;
                    let timer = document.querySelector(".timer");
                    if (timer)
                        timer.innerHTML = "";
                    root?.style.setProperty('--timer-color', "hsl(120, 100%, 50%)");
                    scriptLoaded();
                }, 4000);
            }
            // else
                // destroyTimer();
            } catch (e) {
                console.log("?");
            }
        })();

        function pulseText() {
            back.classed("pulse", true);
            label.classed("pulse", true);

            if ((limitRef.current - timePassed) >= 0) {
                label.style("font-size", "120px")
                .attr("transform", "translate(0," + +6 + ")")
                .text(function(d) {
                    return d.size - d.value;
                });
            }

            label.transition()
                .ease("elastic")
                .duration(900)
                .style("font-size", "90px")
                .attr("transform", "translate(0," + 0 + ")");
        }

        function destroyTimer() {
            label.transition()
                .ease("back")
                .duration(500)
                .style("opacity", "0")
                .style("font-size", "5")
                .attr("transform", "translate(0," + 0 + ")")
                .each("end", function() {
                    field.selectAll("text").remove()
                });

            path.transition()
                .ease("bounce")
                .duration(700)
                .attr("d", nilArc);

            back.transition()
                .ease("bounce")
                .duration(700)
                .attr("d", nilArc)
                .each("end", function() {
                    field.selectAll("path").remove()
                });

            setTimeout(() => {
                svg.remove();
            }, 700);
        }

        function arcTween(b) {
            const c = b.previous === limitRef.current ? {previous: 0} : b;
            let i = window.d3.interpolate({
                value: c.previous
            }, b);
            return function(t) {
                return arc(i(t));
            };
        }
    }

    useEffect(() => {
        pauseRef.current = true;
        limitRef.current = limit > 0 ? limit : 1;
        window.clearTimeout(timerIdRef.current);

        if (limit === limitPrev) return;
        timePassed = 0;
        let timer = document.querySelector(".timer");
        if (timer)
            timer.innerHTML = "";
        root?.style.setProperty('--timer-color', "hsl(120, 100%, 50%)");
        scriptLoaded();
    }, [limit]);

    useEffect(() => {
        width.current = isDemonstration ? 200 : 100;
        height.current = isDemonstration ? 200 : 100;
        arcWidth.current = isDemonstration ? 40 : 20;
        pulseBorder.current = isDemonstration ? 10 : 5;
        pauseRef.current = true;
        limitRef.current = limit > 0 ? limit : 1;
        window.clearTimeout(timerIdRef.current);

        timePassed = 0;
        let timer = document.querySelector(".timer");
        if (timer)
            timer.innerHTML = "";
        root?.style.setProperty('--timer-color', "hsl(120, 100%, 50%)");
        scriptLoaded();
    }, [isDemonstration]);

    useEffect(() => {
        let timer = document.querySelector(".timer");
        if (timer)
            timer.innerHTML = "";
        if (document.getElementById("d3")) {
            scriptLoaded();
            return;
        }
        const script = document.createElement("script");
        script.src = "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js";
        script.async = true;
        script.id = "d3";
        script.onload = () => scriptLoaded();

        document.body.appendChild(script);
    }, []);


    return (
        <div className="timer" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPause(o => !o);
            pauseRef.current = !pauseRef.current;
        }}>

        </div>
    );
}

export default Timer;