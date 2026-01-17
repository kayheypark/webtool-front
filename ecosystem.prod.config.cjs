require('dotenv').config({ path: '.env.prod' })

module.exports = {
  apps: [
    {
      name: 'webtools-front(prod)',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      port: 3000,
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
    },
  ],
}
