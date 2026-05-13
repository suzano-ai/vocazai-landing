// PM2 process configuration for VocazAI on Hostinger KVM VPS.
// Usage:
//   pm2 start ecosystem.config.js --env production
//   pm2 reload ecosystem.config.js --env production   # zero-downtime reload
//   pm2 save                                          # persist across reboots
//   pm2 startup                                       # generate systemd unit
//
// Logs live in ~/.pm2/logs/ — view with:
//   pm2 logs vocazai-landing

module.exports = {
  apps: [
    {
      name: "vocazai-landing",
      cwd: "/var/www/vocazai-landing",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1, // bump to "max" once you've sized the VPS
      exec_mode: "fork", // switch to "cluster" with instances > 1
      autorestart: true,
      max_memory_restart: "512M",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Health & restart policy
      min_uptime: "30s",
      max_restarts: 10,
      restart_delay: 2000,
      // Logs (rotated by pm2-logrotate — install with `pm2 install pm2-logrotate`)
      out_file: "/var/log/vocazai/out.log",
      error_file: "/var/log/vocazai/err.log",
      merge_logs: true,
      time: true,
    },
  ],
};
