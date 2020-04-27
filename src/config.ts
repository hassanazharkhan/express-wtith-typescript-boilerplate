import convict from "convict";

const conf = convict({
    env: {
        format: ['development', 'production', 'test'],
        default: 'development',
        env: 'NODE_ENV',
    },
    server: {
        port: {
            format: 'port',
            default: 3000,
            env: 'NODE_PORT',
        },
    },
    database: {
        host: {
            format: '*',
            default: 'localhost',
            env: 'DB_HOST',
        },
        port: {
            format: 'port',
            default: 5432,
            env: 'DB_PORT',
        },
        name: {
            format: '*',
            default: 'postgres',
            env: 'DB_NAME',
        },
        username: {
            format: '*',
            default: 'postgres',
            env: 'DB_USERNAME',
        },
        password: {
            format: '*',
            default: 'postgres',
            env: 'DB_PASSWORD',
        },
    },
});

conf.validate({ allowed: 'strict' });

export default conf.getProperties();
