#!/usr/bin/env bash
npm config set -g production false
npm i
npm config set -g production true