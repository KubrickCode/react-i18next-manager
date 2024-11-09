root_dir := justfile_directory()
frontend_dir := root_dir + "/src/frontend"
backend_dir := root_dir + "/src/backend"
package_dir := root_dir + "/src/package"

codegen:
  cd "{{ backend_dir }}" && npx openapi-typescript swagger-spec.json --output {{ frontend_dir }}/src/core/codegen/generated.tsx

default:
  @just --list

deps: deps-frontend deps-backend deps-package

deps-frontend:
  cd "{{ frontend_dir }}" && yarn install

deps-frontend-i18n:
  cd "{{ frontend_dir }}" && yarn add @kubrick/react-i18next-manager

deps-backend:
  cd "{{ backend_dir }}" && yarn install

deps-package:
  cd "{{ package_dir }}" && yarn install

package-build:
  cd "{{ package_dir }}" && yarn build

package-init:
  cd "{{ package_dir }}" && chmod +x dist/init.js && npx init

package-publish:
  cd "{{ package_dir }}" && npm publish --access public

package-studio:
  cd "{{ package_dir }}" && chmod +x dist/main.js && npx @kubrick/react-i18next-manager studio

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

    app)
      just run frontend &
      just run backend
      ;;

    i18n)
      cd "{{ frontend_dir }}" && yarn i18n studio
      ;;
      
  esac

test *args:
  cd "{{ backend_dir }}" && yarn test {{args}}

test-cov:
  cd "{{ backend_dir }}" && yarn test:cov