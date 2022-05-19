// Create a clock with an initial time (in seconds) and an increment (in seconds)
class Clock
{
    constructor(hours, minutes, seconds, increment)
    {
        this.initialTime = [minutes, seconds];
        // this.hasHours = minutes >= 60;
        this.minutes = minutes;
        this.seconds = seconds;
        this.tensOfSeconds = 0;
        this.increment = increment;
        this.intervalId  = null;
    }

    getTime()
    {
        return (this.minutes * 60 + this.seconds) * 1000 + this.tensOfSeconds;
    }

    getTimeControl()
    {
        return this.initialTime[0] + '+' + this.increment;
    }

    tick()
    {
        this.tensOfSeconds--
        if (this.tensOfSeconds < 0)
        {
            this.tensOfSeconds = 9;
            this.seconds--;
            if (this.seconds < 0)
            {
                this.seconds = 59;
                this.minutes--;
                if (this.minutes < 0)
                {
                    this.stop();
                    this.minutes = 0;
                    this.seconds = 0;
                    this.tensOfSeconds = 0;
                }
            }
        }
    }

    start()
    {
        this.intervalId = setInterval(() => {
            this.tick();
            // console.log(this.getClock() + ':' + this.tensOfSeconds);       
        }, 100);
    }

    stop()
    {
        clearInterval(this.intervalId);
    }

    addIncrement()
    {
        console.log('add increment');
        // this.seconds += this.increment;
        // if (this.seconds > 59)
        // {
        //     this.minutes += Math.trunc(this.seconds / 60); // integer value
        //     this.seconds = this.seconds % 60;
        //     if (this.minutes > 59)
        //     {
        //         this.hours += Math.trunc(this.minutes / 60); // integer value
        //         this.minutes = this.minutes % 60;
        //     }
        // }
    }

    reinitiate()
    {
        this.minutes = this.initialTime[0];
        this.seconds = this.initialTime[1];
        this.tensOfSeconds = 0;
    }

    getClock()
    {
        let clock = [];
        if (this.hasHours)
        {
            if (this.hours > 9)
            {
                clock.push(this.hours);
            }
            else
            {
                clock.push('0' + this.hours)
            }
        }

        if (this.minutes > 9)
        {
            clock.push(this.minutes);
        }
        else
        {
            clock.push('0' + this.minutes)
        }

        if (this.seconds > 9)
        {
            clock.push(this.seconds);
        }
        else
        {
            clock.push('0' + this.seconds)
        }

        return clock.map(unity => unity).join(':');
    }
}
