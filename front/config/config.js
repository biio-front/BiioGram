const pro = process.env.NODE_ENV === 'production';
export const backURL = pro ? 'https://api.biiogram.ga' : 'http://localhost:3055';
export const frontURL = pro ? 'https://biiogram.ga' : 'http://localhost:3050';
