export function getDate(value) {

    if (!value) return "N/A"; // Handle null, undefined, or empty string


    const isoDateString = value;
    const date = new Date(isoDateString);
    // Format date into "DD MMM YYYY"
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate
}

export function getTime(value) {

    if (!value) return "N/A"; // Handle null, undefined, or empty string
    

    const isoDateString = value;
    const date = new Date(isoDateString);
    // Get hours, minutes, and determine AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
}


export function convertToAmPm(time) {

    if (!time) return "N/A"; // Handle null, undefined, or empty string


    // Split the time into hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Determine if it's AM or PM
    const period = hours >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Return the formatted time
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}


export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
};

export const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero for hours
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero for minutes
    return `${hours}:${minutes}`;
};


