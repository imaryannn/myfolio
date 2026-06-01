const isLocalDev =
    window.location.protocol === 'file:' ||
    window.location.hostname === '' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalDev
    ? 'http://127.0.0.1:3000'
    : 'https://backendaryanfolio.vercel.app';
