root_dir := justfile_directory()
frontend_dir := root_dir + "/src/frontend"
backend_dir := root_dir + "/src/backend"
package_dir := root_dir + "/src/package"
test_web_dir := root_dir + "/src/test-web"
scripts_dir := root_dir + "/src/scripts"

codegen:
  node "{{ scripts_dir }}/codegen.js"

default:
  @just --list

deps: deps-frontend deps-backend deps-package deps-test-web

deps-frontend:
  cd "{{ frontend_dir }}" && yarn install

deps-backend:
  cd "{{ backend_dir }}" && yarn install

deps-package:
  cd "{{ package_dir }}" && yarn install

deps-test-web:
  cd "{{ test_web_dir }}" && yarn install

deps-upgrade-test-web:
  cd "{{ test_web_dir }}" && yarn add @kubrick/react-i18next-manager

package-publish:
  cd "{{ package_dir }}" && npm publish --access public

package-version *version:
  cd "{{ package_dir }}" && npm version {{version}}

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

    test-web)
      cd "{{ test_web_dir }}"
      GENERATE_SOURCEMAP=false yarn dev
      ;;

    test-web-studio)
      cd "{{ test_web_dir }}"
      yarn i18n studio
      ;;

    test-web-init)
      cd "{{ test_web_dir }}"
      yarn i18n init
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
      npx @kubrick/react-i18next-manager studio
      ;;

    package-init)
      cd "{{ package_dir }}"
      chmod +x dist/init.js
      npx init
      ;;

  esac