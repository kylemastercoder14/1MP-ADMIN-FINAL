module.exports = {
  apps: [
    {
      name: "admin",
      script: "npm",
      args: "start",
      cwd: "/home/kylemastercoder14/apps/1MP-ADMIN-FINAL",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};

