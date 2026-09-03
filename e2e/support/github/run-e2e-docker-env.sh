#!/usr/bin/env bash
# NOTE: flags passed via `env bash -eu` are not portable, so set them here instead.
set -euo pipefail

# get the dir containing the script
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# create a temporary working directory
working_dir=$(mktemp -d "${TMPDIR:-/tmp/}openmrs-e2e-frontends.XXXXXXXXXX")
# get a list of all the apps in this workspace
apps=$(yarn workspaces list --json | jq -r 'select((.location != ".") and (.location | test("-app"))) | .name')
# this array will hold all of the packed app names
app_names=()

echo "Creating packed archives of apps..."
# for each app
for app in $apps
do
  # @openmrs/esm-whatever -> _openmrs_esm_whatever
  app_name=$(echo "$app" | tr '[:punct:]' '_');
  # add to our array
  app_names+=("$app_name.tgz");
  # run yarn pack for our app and add it to the working directory
  yarn workspace "$app" pack -o "$working_dir/$app_name.tgz" >/dev/null;
done;
echo "Created packed app archives"

echo "Creating dynamic spa-assemble-config.json..."
# dynamically assemble our list of frontend modules, prepending the login app and
# primary navigation apps; apps will all be in the /app directory of the Docker
# container
jq -n \
  --arg apps "$apps" \
  --arg app_names "$(echo ${app_names[@]})" \
  '{"@openmrs/esm-primary-navigation-app": "next", "@madiro/esm-home-app": "next", "@openmrs/esm-patient-chart-app": "next"} + (
    ($apps | split("\n")) as $apps | ($app_names | split(" ") | map("/app/" + .)) as $app_files
    | [$apps, $app_files]
    | transpose
    | map({"key": .[0], "value": .[1]})
    | from_entries
  )' | jq '{"frontendModules": .}' > "$working_dir/spa-assemble-config.json"
echo "Created dynamic spa-assemble-config.json"
cat "$working_dir/spa-assemble-config.json"

# An empty module map assembles a SPA with none of our apps in it. `openmrs assemble`
# exits 0 in that case, so without this guard the suite runs against a distro that is
# missing every extension under test and fails with unrelated "element not found" errors.
module_count=$(jq '.frontendModules | length' "$working_dir/spa-assemble-config.json")
if [[ "$module_count" -eq 0 ]]; then
  echo "ERROR: no frontend modules resolved into spa-assemble-config.json" >&2
  exit 1
fi
echo "Resolved $module_count frontend modules"

echo "Copying Docker configuration..."
cp "$script_dir/Dockerfile" "$working_dir/Dockerfile"
cp "$script_dir/docker-compose.yml" "$working_dir/docker-compose.yml"

cd $working_dir
echo "Starting Docker containers..."
# CACHE_BUST to ensure the assemble step is always run
docker compose build --build-arg CACHE_BUST=$(date +%s) frontend
docker compose up -d

# The image we build and the container that ends up serving the SPA have disagreed:
# the build produced an importmap containing our apps while the running frontend served
# the upstream one. Report what is actually being served before the tests depend on it.
echo "Verifying the running frontend serves our assembled SPA..."
docker compose exec -T frontend sh -c \
  'echo "importmap bytes: $(wc -c < /usr/share/nginx/html/importmap.json)"; \
   echo "our apps in importmap:"; \
   grep -o "@madiro/[a-z-]*" /usr/share/nginx/html/importmap.json | sort -u; \
   echo "our app dirs:"; ls -d /usr/share/nginx/html/madiro-* 2>/dev/null || echo "  NONE"'
