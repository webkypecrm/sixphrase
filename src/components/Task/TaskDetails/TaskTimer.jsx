import React, { useEffect, useState } from 'react';

const TaskTimer = ({ startDate, endDate }) => {

    const calculateRemainingTime = () => {
        const now = new Date();
        const end = new Date(endDate+"T00:00:00");
        const totalSeconds = Math.max((end - now) / 1000, 0);

        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return { days, hours, minutes };
    };

    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(calculateRemainingTime());
        }, 60000); // Update every minute

        return () => clearInterval(intervalId); // Clear interval on unmount
    }, [endDate]);

    return (
        <div>
            {timeLeft.days} Days {timeLeft.hours} Hours {timeLeft.minutes} Min
        </div>
    );
};

export default TaskTimer;