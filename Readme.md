
# YOUAPP - CRUD 



## File Structure
```bash
├ app                      # base Directory of app 
  ├ /assets                # including files static asset.
  ├ /dist                  # build directory 
  ├ /src                   # a main source of app 
    ├ /common              # an object configuration that purposing to comunicated the data.
      ├ /dtos              # an directory class to validate the data before it write to databases.
      ├ /interfaces        # an directory interfaces to build the comunicate between any data to shema object of databases.
      ├ /schems            # an diretoryclass to define the schema of databases.
    ├ /main                # an directory that including configuration API.
    ├ /middlewares         # an directory to build flow of services before it really executed.
    ├ /tests               # a strategy about the  custom unit & integrations testing, that i named it as a "Awesome Sequential Testing".
      ├ _config            # a configuration folder for testing strategy. 
      ├ integrations       # a directory that would be scanned by system while running the test stage.
      ├ stubs              # including data mock of testing.
      ├ init.spec.ts       # core system of testing strategy. 
    ├ /utilities           # a directory that including some utility function.
    ├ app.module.ts        # a main module to initiate register some of configurations.
    ├ app.router.ts        # an files configuration the router controllers.
    ├ app.validation.ts    # an files configuration to realize the implement of stack middlewares.
    ├ main.ts              # root of server
  ├ .env.test              # file environment for testing stage.
  ├ .env.dev               # file environment for development stage.
  ├ .env.prod              # file environment for production stage.
  ├ package.json           # an file configuration that saving about whatever modules used.
  ├ tsconfig.json          # an file configuration of typescript. 
├ /db                      # base Directory of database
  ├ Dockerfile             # file Docker to generating the mongodb container.
  ├ query.js               # the init file that will creating user admin on every stage environment.
├ docker-compose.yml       # a files to packing some docker in one configurations file.
```
## About Strategy of Testing
The strategy of testing was builded with the
purpose is for a simply way on configuring the 
testing, leaving out the repeatable on defining the modules, and runing the testing step-by-step with setting up the index of sequence in name of function.

**The implentation is looks like :**
```bash
# assigned function testing
$1_test1a
$3_test3
$2_test2
$4_test4
$01_test1b
```

**Result :**
```bash
# compiling result
$1_test1a       # test passed
$01_test1b      # test passed
$2_test2        # test passed
$3_test3        # test passed
$4_test4        # test passed
```

**Rules :**
- the name of file testing must be as **_*.afx.ts_**
- the name of function must be prefixed as **_$([0-9]+)_<function_name>**
- put all config test file inside of folder **_src/tests/integrations_**
## Stack of Middlewares
describe stack here
## Installation

- clone repository : **_git clone <url>_**
- build docker images : **_docker-compose build_**
- build & run containers : **_docker-compose up -d_**

**Service Access :**

API : [localhost:3000](localhost:3000) / [183.77.86.1:3000](183.77.86.1)

Database : **_mongo -u aidil -p crud2023 --port 23993_**

Postman : <Postman Documentation Urls>





    

## Tech Stack
[![My Skills](https://skillicons.dev/icons?i=nodejs,nest,docker,bash,ts,js)](https://skillicons.dev)