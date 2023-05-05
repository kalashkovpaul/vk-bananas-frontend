import React, { useEffect, useRef, useState } from "react";
import './timer.css';

// type TimerProps = {
//     limit: number;
// }

const Timer = (props) => {
    const {limit, isDemonstration, onTimerStart, onTimerEnd, shouldDestroy} = props;
    // const limit = 30;
    const width = useRef(isDemonstration ? 200 : 100);
    const height = useRef(isDemonstration ? 200 : 100);
    const arcWidth = useRef(isDemonstration ? 40 : 20);
    const pulseBorder = useRef(isDemonstration ? 10 : 5);
    const timePassed = useRef(0);

    const root = document.querySelector(':root');
    const [isPause, setPause] = useState(false);
    const pauseRef = useRef(true);
    const limitRef = useRef(limit > 0 ? limit : 1);
    const timerIdRef = useRef(0);

    const nilArcRef = useRef(null);
    const arcRef = useRef(null);
    const svgRef = useRef(null);
    const fieldRef = useRef(null);
    const backRef = useRef(null);
    const pathRef = useRef(null);
    const labelRef = useRef(null);
    const isEndedRef = useRef(false);
    const shouldDestroyRef = useRef(false);

    const usePreviousLimit = (value) => {
        const prevLimitRef = useRef(value);
          useEffect(() => {
              prevLimitRef.current = value;
          });
          return prevLimitRef.current
    };

    // useEffect(() => {
    //     if (isPause) {
    //         onTimerStart();
    //     }
    // }, [isPause]);

    useEffect(() => {
        shouldDestroyRef.current = shouldDestroy;
    }, [shouldDestroy]);

    const limitPrev = usePreviousLimit(limit);

    const scriptLoaded = () => {
        isEndedRef.current = false;
        if (!window.d3 || !window.d3.svg) return;
        const fields = [{
            value: limitRef.current,
            size: limitRef.current,
            update: function() {
                return timePassed.current = timePassed.current + 1;
            }
        }];

        nilArcRef.current = window.d3?.svg.arc()
            .innerRadius(width.current / 3 - 133)
            .outerRadius(width.current / 3 - 133)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        arcRef.current = window.d3?.svg.arc()
            .innerRadius(width.current / 2 - arcWidth.current)
            .outerRadius(width.current / 2)
            .startAngle(0)
            .endAngle(function(d) {
              return ((d.value / d.size) * 2 * Math.PI);
            });

        svgRef.current = window.d3?.select(".timer").append("svg")
            .attr("width", width.current)
            .attr("height", height.current);

        fieldRef.current = svgRef.current?.selectAll(".field")
            .data(fields)
            .enter().append("g")
            .attr("transform", "translate(" + width.current / 2 + "," + height.current / 2 + ")")
            .attr("class", "field");

        backRef.current = fieldRef.current?.append("path")
            .attr("class", "path path--background")
            .attr("d", arcRef.current);

        pathRef.current = fieldRef.current?.append("path")
            .attr("class", "path path--foreground");

        labelRef.current = fieldRef.current?.append("text")
            .attr("class", "label")
            .attr("dy", ".35em");

        function getColor(value) {
            //value from 0 to 1
            var hue = ((1 - value) * 120).toString(10);
            return ["hsl(", hue, ",100%,50%)"].join("");
        }

        function update() {
            try {
                if (pauseRef.current) {
                    labelRef.current?.text(function(d) {
                        return d.size - d.value || limitRef.current;
                    });
                    if (timePassed.current <= limitRef.current && !timerIdRef.current) {
                        timerIdRef.current = window.setInterval(update, 1000);
                    }
                    // timerIdRef.current = 0;
                    return;
                }

            root?.style.setProperty('--timer-color', getColor(timePassed.current < limitRef.current / 2 ?  0 : timePassed.current / limitRef.current / 2));

            fieldRef.current
                ?.each(function(d) {
                    d.previous = d.value;
                    d.value = d.update(timePassed.current);
                });


            pathRef.current?.transition()
                .ease("elastic")
                .duration(500)
                .attrTween("d", arcTween);

            if ((limitRef.current - timePassed.current) <= pulseBorder.current)
                pulseText();
            else
                labelRef.current
                .text(function(d) {
                    return d.size - d.value;
                });

            if (timePassed.current <= limitRef.current) {

            }
            //     timerIdRef.current = window.setTimeout(update, 1000 - (timePassed % 1000));
            else {
                shouldDestroyRef.current = true;
                setTimeout(() => {
                    // onTimerEnd();
                    timePassed.current = 0;
                    pauseRef.current = true;
                    let timer = document.querySelector(".timer");
                    if (timer)
                    timer.innerHTML = "";
                    root?.style.setProperty('--timer-color', "hsl(120, 100%, 50%)");
                    scriptLoaded();
                }, 4000);
            }
            destroyTimer();
            // timerIdRef.current = 0;
            // else
                // destroyTimer();
            } catch (e) {
                console.log("?");
            }
        };

        function pulseText() {
            backRef.current.classed("pulse", true);
            labelRef.current.classed("pulse", true);

            if ((limitRef.current - timePassed.current) >= 0) {
                labelRef.current.style("font-size", "120px")
                .attr("transform", "translate(0," + +6 + ")")
                .text(function(d) {
                    return d.size - d.value;
                });
            }

            labelRef.current.transition()
                .ease("elastic")
                .duration(900)
                .style("font-size", "90px")
                .attr("transform", "translate(0," + 0 + ")");
        }

        function destroyTimer() {
            if (!shouldDestroyRef.current) return;

            setTimeout(() => {
                if (!isEndedRef.current) {
                    isEndedRef.current = true;
                    onTimerEnd();
                }
            }, 1000);
            labelRef.current.transition()
                .ease("back")
                .duration(500)
                .style("opacity", "0")
                .style("font-size", "5")
                .attr("transform", "translate(0," + 0 + ")")
                .each("end", function() {
                    fieldRef.current.selectAll("text").remove()
                });

            pathRef.current.transition()
                .ease("bounce")
                .duration(700)
                .attr("d", nilArcRef.current);

            backRef.current.transition()
                .ease("bounce")
                .duration(700)
                .attr("d", nilArcRef.current)
                .each("end", function() {
                    fieldRef.current.selectAll("path").remove()
                });

            setTimeout(() => {
                svgRef.current.remove();
            }, 700);
        }

        function arcTween(b) {
            const c = b.previous === limitRef.current ? {previous: 0} : b;
            let i = window.d3.interpolate({
                value: c.previous
            }, b);
            return function(t) {
                return arcRef.current(i(t));
            };
        }

        update();
    }

    useEffect(() => {
        pauseRef.current = true;
        limitRef.current = limit > 0 ? limit : 1;
        window.clearTimeout(timerIdRef.current);
        timerIdRef.current = 0;
        shouldDestroyRef.current = false;

        if (limit === limitPrev) return;
        timePassed.current = 0;
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
        timerIdRef.current = 0;
        shouldDestroyRef.current = false;
        timePassed.current = 0;
        let timer = document.querySelector(".timer");
        if (timer)
            timer.innerHTML = "";
        root?.style.setProperty('--timer-color', "hsl(120, 100%, 50%)");
        scriptLoaded();
    }, [isDemonstration]);

    const addListener = () => {
        const timer = document.querySelector(".timer");
        if (!timer.getAttribute('listener')) {
            timer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (pauseRef.current) {
                    onTimerStart();
                    setTimeout(() => {
                        setPause(false);
                    });
                } else {
                    setPause(o => !o);
                }
                pauseRef.current = !pauseRef.current;
            });
            timer.setAttribute('listener', 'true');
        }
    }

    useEffect(() => {
        let timer = document.querySelector(".timer");
        if (timer)
            timer.innerHTML = "";
        addListener();
        if (document.getElementById("d3")) {
            scriptLoaded();
            // return;
        } else {
            const script = document.createElement("script");
            script.src = "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js";
            script.async = true;
            script.id = "d3";
            script.onload = () => scriptLoaded();
            document.body.appendChild(script);
        }
        return () => {
            window.clearTimeout(timerIdRef.current);
            timer.removeAttribute('listener');
        }
    }, []);


    return (
        <div className="timer">

        </div>
    );
}

export default Timer;