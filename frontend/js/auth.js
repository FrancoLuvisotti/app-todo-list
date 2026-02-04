function getUserFromToken() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

function getUserFromToken() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}
