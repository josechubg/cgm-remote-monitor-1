# Use the published Nightscout release and its unprivileged runtime.
FROM docker.io/nightscout/cgm-remote-monitor:15.0.8

ENV PORT=1337
ENV NIGHTSCOUT_HOSTNAME=0.0.0.0
EXPOSE 1337

# Allow a plain password in Render's private setup form; encode it at runtime.
COPY --chown=node:node mongodb-env.cjs /opt/app/deployment2026-mongodb-env.cjs
CMD ["node", "--require", "/opt/app/deployment2026-mongodb-env.cjs", "lib/server/server.js"]
