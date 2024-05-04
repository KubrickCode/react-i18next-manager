root_dir := justfile_directory()
frontend_dir := root_dir + "/src/frontend"

default:
  @just --list

deps: deps-frontend

deps-frontend:
  cd "{{ frontend_dir }}" && yarn install

run svc *args:
  #!/usr/bin/env bash
  set -euox pipefail
  case {{ svc }} in
    frontend)
      cd "{{ frontend_dir }}"
      GENERATE_SOURCEMAP=false PORT=3000 yarn dev
      ;;
  
  esac