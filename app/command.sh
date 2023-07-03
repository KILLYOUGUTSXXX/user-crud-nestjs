#!/bin/sh

# BASE_ENV_SRC

if [[ $BASE_ENV_SRC = "DEVELOPMENT" ]]; then
  npm run start:dev;
elif [[ $BASE_ENV_SRC = "PRODUCTION" ]]; then
  npm run test;
  
  failed_tes=$(cat jest-result | jq -r .numFailedTests);

  if [[ $(($failed_tes)) > 0 ]]; then
    echo -e '\e[31mService is not running, because the test is failure.'
  else
    npm run build;
    npm run start:prod;
  fi;
  
fi;