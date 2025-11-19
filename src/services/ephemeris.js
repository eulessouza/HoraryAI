export const ephemerisData = {
    { name: 'Sun', position: '15° Aries' },
    { name: 'Moon', position: '23° Taurus' },
    { name: 'Mercury', position: '5° Gemini' },
    { name: 'Venus', position: '18° Cancer' },
    { name: 'Mars', position: '30° Leo' },
    { name: 'Jupiter', position: '21° Virgo' },
    { name: 'Saturn', position: '9° Libra' },
    { name: 'Uranus', position: '19° Scorpio' },
    { name: 'Neptune', position: '6° Sagittarius' },
    { name: 'Pluto', position: '110° Capricorn' }
};

export function getEphemeris() {
    return ephemerisData;
}