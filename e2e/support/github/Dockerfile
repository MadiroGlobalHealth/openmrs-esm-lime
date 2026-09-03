# syntax=docker/dockerfile:1.3
FROM --platform=$BUILDPLATFORM node:22-alpine AS dev

ARG APP_SHELL_VERSION=next

RUN mkdir -p /app
WORKDIR /app

COPY . .

RUN npm_config_legacy_peer_deps=true npm install -g openmrs@${APP_SHELL_VERSION:-next}
ARG CACHE_BUST
RUN npm_config_legacy_peer_deps=true openmrs assemble --manifest --mode config --config spa-assemble-config.json --target ./spa

# `openmrs assemble` exits 0 even when it writes nothing, which yields a distro missing
# every app under test and e2e failures that point at the widgets instead of the assembly.
RUN echo "--- assembled SPA ---" && ls -la ./spa && du -sh ./spa && \
    echo "--- importmap ---" && cat ./spa/importmap.json && echo && \
    for dir in ./spa/madiro-*; do \
      echo "$dir: $(ls -1 "$dir" | wc -l) files"; \
    done && \
    test -s ./spa/importmap.json || (echo "ERROR: assembled SPA has no importmap" >&2; exit 1)

FROM --platform=$BUILDPLATFORM openmrs/openmrs-reference-application-3-frontend:nightly AS frontend
FROM nginx:1.23-alpine

RUN apk update && \
  apk upgrade && \
  apk add --no-cache moreutils

RUN rm -rf /usr/share/nginx/html/*

COPY --from=frontend /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend /usr/share/nginx/html/* /usr/share/nginx/html/
COPY --from=frontend /usr/local/bin/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

COPY --from=dev /app/spa/ /usr/share/nginx/html/

# The reference application image ships pre-compressed .br/.gz siblings next to its
# assets, and nginx serves those in preference to the plain file. `openmrs assemble`
# writes only uncompressed files, so our importmap.json and routes.registry.json landed
# on disk while nginx kept serving the stale upstream copies -- a distro with none of our
# apps in it. Drop any compressed sibling whose plain file is present so ours wins.
RUN find /usr/share/nginx/html -maxdepth 1 \( -name '*.br' -o -name '*.gz' \) \
      -exec sh -c 'for f; do [ -f "${f%.*}" ] && rm -f "$f"; done' sh {} +

CMD ["/usr/local/bin/startup.sh"]
