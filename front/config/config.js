const pro = process.env.NODE_ENV === 'production';
export const backURL = pro ? 'http://api.biiogram.ga' : 'http://localhost:80';
export const frontURL = pro ? 'http://biiogram.ga' : 'http://localhost:3050';
