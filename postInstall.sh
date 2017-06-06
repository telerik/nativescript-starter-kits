#!/usr/bin/env bash

TEMP_DIR="${PWD}/lib/templates"

GREEN='\033[1;32m'
RED='\033[1;31m'
W
NC='\033[0m'

echo "${TEMP_DIR}"

function downloadTemplates () {
    if [ ! -d ${TEMP_DIR} ]; then
        mkdir -p ${TEMP_DIR};
    fi

    echo "Downloading Templates"
    cd ${TEMP_DIR}
    git clone "git@github.com:NativeScript/template-drawer-navigation-ts.git"
    git clone "git@github.com:NativeScript/template-drawer-navigation-ng.git"

    if [ $? -eq 0 ]; then
        echo -e ${GREEN}OK${NC}
        cd ${PWD}
        exit 0
    else
        echo -e ${RED}FAIL${NC}
        exit 1
    fi
}

downloadTemplates
