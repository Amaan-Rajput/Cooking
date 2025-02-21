export const getTime = minute => {
    const hour = Math.floor(minute / 60)
    const day = Math.floor(hour / 24);

    const time = day || hour || minute;
    const unitindex = [day, hour, minute].lastIndexOf(time);
    const timeUniit = ["day", "hour", "minute"][unitindex];

    return { time, timeUniit }
}  