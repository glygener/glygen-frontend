#!/usr/bin/env bash
#
# Glygen deployment script
# Migrated from MakeFile -> upgraded to use the Docker Compose v2 plugin
# ("docker compose", not the legacy standalone "docker-compose" binary).
#
# Usage:
#   ./deploy.sh <target>
#
# Targets:
#   network            Create the prod network if it doesn't exist
#   network-beta        Create the beta network if it doesn't exist
#   network-dev          Create the dev network if it doesn't exist
#   network-test         Create the test network if it doesn't exist
#   network-biom-prod   Create the biom-prod network if it doesn't exist
#   network-biom-dev     Create the biom-dev network if it doesn't exist
#   prod                Deploy production stack
#   beta                Deploy beta stack
#   test                Deploy test stack
#   dev                 Deploy dev stack (stops/removes/recreates, detached)
#   biom-prod           Deploy biom-prod stack
#   biom-dev             Deploy biom-dev stack
#   clean                Prune the whole docker system
#
# Example:
#   ./deploy.sh dev

set -euo pipefail

# ------------------------------------------------------------------
# Config
# ------------------------------------------------------------------
GLYGEN_NETWORK="glygen-network"
GLYGEN_NETWORK_BETA="glygen-network-beta"
GLYGEN_NETWORK_DEV="glygen-network-dev"
GLYGEN_NETWORK_TEST="glygen-network-test"
GLYGEN_NETWORK_BIOM_PROD="glygen-network-biom-prod"
GLYGEN_NETWORK_BIOM_DEV="glygen-network-biom-dev"

# Modern docker compose CLI (plugin syntax, "docker compose" — no hyphen).
# Falls back to legacy "docker-compose" if the plugin isn't installed,
# so the script still works on older hosts.
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
    echo "Warning: using legacy 'docker-compose' binary; consider upgrading to the docker compose plugin." >&2
    DOCKER_COMPOSE=(docker-compose)
else
    echo "Error: neither 'docker compose' (plugin) nor 'docker-compose' (legacy) was found." >&2
    exit 1
fi

# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

# create_network <name> - create a docker network if it doesn't already exist
create_network() {
    local name="$1"
    if ! docker network ls --format '{{ .Name }}' | grep -qx "${name}"; then
        docker network create "${name}"
    fi
}

# compose_deploy <project_name> <extra_compose_file> <up_mode>
# up_mode is either "--no-start" (build only, don't start) or "-d" (detached, running)
compose_deploy() {
    local project_name="$1"
    local extra_file="$2"
    local up_mode="$3"

    "${DOCKER_COMPOSE[@]}" -f docker-compose.yml -f "${extra_file}" --project-name "${project_name}" rm --force
    "${DOCKER_COMPOSE[@]}" -f docker-compose.yml -f "${extra_file}" --project-name "${project_name}" up "${up_mode}" --build
    docker image prune --force
}

# ------------------------------------------------------------------
# Targets
# ------------------------------------------------------------------

target_network()           { create_network "${GLYGEN_NETWORK}"; }
target_network_beta()      { create_network "${GLYGEN_NETWORK_BETA}"; }
target_network_dev()       { create_network "${GLYGEN_NETWORK_DEV}"; }
target_network_test()      { create_network "${GLYGEN_NETWORK_TEST}"; }
target_network_biom_prod() { create_network "${GLYGEN_NETWORK_BIOM_PROD}"; }
target_network_biom_dev()  { create_network "${GLYGEN_NETWORK_BIOM_DEV}"; }

target_prod() {
    target_network
    compose_deploy "glygen-frontend" "docker-compose.prod.yml" "--no-start"
}

target_beta() {
    target_network_beta
    compose_deploy "glygen-frontend-beta" "docker-compose.beta.yml" "--no-start"
}

target_test() {
    target_network_test
    compose_deploy "glygen-frontend-test" "docker-compose.test.yml" "--no-start"
}

target_dev() {
    target_network_dev
    "${DOCKER_COMPOSE[@]}" -f docker-compose.yml -f docker-compose.dev.yml --project-name glygen-frontend-dev stop
    "${DOCKER_COMPOSE[@]}" -f docker-compose.yml -f docker-compose.dev.yml --project-name glygen-frontend-dev rm --force
    "${DOCKER_COMPOSE[@]}" -f docker-compose.yml -f docker-compose.dev.yml --project-name glygen-frontend-dev up -d --build
    docker image prune --force
}

target_biom_prod() {
    target_network_biom_prod
    compose_deploy "glygen-frontend-biom-prod" "docker-compose.biom-prod.yml" "--no-start"
}

target_biom_dev() {
    target_network_biom_dev
    compose_deploy "glygen-frontend-biom-dev" "docker-compose.biom-dev.yml" "--no-start"
}

target_clean() {
    docker system prune --force
}

# ------------------------------------------------------------------
# Dispatch
# ------------------------------------------------------------------

usage() {
    grep '^#' "$0" | sed -e 's/^#//' -e 's/^ //'
    exit 1
}

main() {
    local target="${1:-}"

    case "${target}" in
        network)          target_network ;;
        network-beta)      target_network_beta ;;
        network-dev)       target_network_dev ;;
        network-test)      target_network_test ;;
        network-biom-prod) target_network_biom_prod ;;
        network-biom-dev)  target_network_biom_dev ;;
        prod)              target_prod ;;
        beta)              target_beta ;;
        test)              target_test ;;
        dev)               target_dev ;;
        biom-prod)         target_biom_prod ;;
        biom-dev)          target_biom_dev ;;
        clean)             target_clean ;;
        -h|--help|help|"") usage ;;
        *)
            echo "Unknown target: ${target}" >&2
            usage
            ;;
    esac
}

main "$@"
