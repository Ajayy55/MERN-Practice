import fs from 'fs'

export const readData = (DATA_FILE) => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.appendFileSync(DATA_FILE, JSON.stringify([]));
    }
    const rawData = fs.readFileSync(DATA_FILE);
    return JSON.parse(rawData);
};

export const writeData = (DATA_FILE,data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};