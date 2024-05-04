root_dir := justfile_directory()
frontend_dir := root_dir + "/src/frontend"
backend_dir := root_dir + "/src/backend"
package_dir := root_dir + "/src/package"

default:
  @just --list

deps: deps-frontend deps-backend deps-package

deps-frontend:
  cd "{{ frontend_dir }}" && yarn install

deps-backend:
  cd "{{ backend_dir }}" && yarn install

deps-package:
  cd "{{ package_dir }}" && yarn install

run svc *args:
  #!/usr/bin/env bash
  set -euox pipefail
  case {{ svc }} in
    frontend)
      cd "{{ frontend_dir }}"
      GENERATE_SOURCEMAP=false PORT=3000 yarn dev
      ;;

    backend)
      cd "{{ backend_dir }}"
      PORT=3001 yarn dev
      ;;

    app)
      just run frontend &
      just run backend
      ;;

    package-build)
      cd "{{ package_dir }}"
      yarn build
      ;;

    package-studio)
      cd "{{ package_dir }}"
      chmod +x dist/main.js
      npx studio
      ;;
  
  esac