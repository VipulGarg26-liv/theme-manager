import pool from './pool';

pool.on('connect', () => {
    console.log('connected to the db');
});

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

require('make-runnable');