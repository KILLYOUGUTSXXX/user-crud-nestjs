#!/bin/sh

# BASE_ENV_SRC

if [[ $BASE_ENV_SRC = "DEVELOPMENT" ]]; then
  npm run start:dev;
elif [[ $BASE_ENV_SRC = "PRODUCTION" ]]; then
  npm run test;
  
  failed_test=$(cat jest-result | jq -r .numFailedTests);
  echo "Failed Test Totals : ${failed_test}";

  if [[ $(($failed_test)) -gt 0 ]]; then
    echo -e '\e[31mService is not running, because the test is failure.'
  else
    npm run build;
    npm run start:prod;
  fi;
  
fi;