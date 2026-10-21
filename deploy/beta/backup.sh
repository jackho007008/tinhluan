#!/bin/sh
set -eu
umask 077
# env parsing belongs to Node, not shell sourcing of secrets.
exec /usr/local/bin/node --env-file=/etc/tinhluan/beta.env deploy/beta/backup.mjs "/var/backups/tinhluan/$(date -u +%Y%m%dT%H%M%SZ)"
