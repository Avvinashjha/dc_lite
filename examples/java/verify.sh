#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if [ -n "${JAVA_HOME:-}" ]; then PATH="$JAVA_HOME/bin:$PATH"; export PATH; fi
(unset TEST_DB_URL TEST_DB_USER TEST_DB_PASSWORD; ./mvnw "$@" --batch-mode verify)
if [ -n "${TEST_DB_URL:-}" ]; then
  ./mvnw "$@" --batch-mode -pl backend test
fi
mkdir -p modules/target/classes
javac -d modules/target/classes modules/hello/module-info.java modules/hello/in/dailycoder/hello/Main.java
java --module-path modules/target/classes --module course.hello/in.dailycoder.hello.Main
runtime_root=$(mktemp -d)
trap 'rm -rf "$runtime_root"' EXIT HUP INT TERM
jlink --module-path modules/target/classes --add-modules course.hello --output "$runtime_root/image"
"$runtime_root/image/bin/java" --module course.hello/in.dailycoder.hello.Main
