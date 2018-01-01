# moovel node.js routing-data-provider

[![Dependency Status](https://www.versioneye.com/user/projects/5991abc9368b08001110184c/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/5991abc9368b08001110184c)


The routing-data-provider project receives mobilitypoints data from redis channels and also directly from providers like car2go, nextbike etc. (e.g. operation areas).
The collected data is provided to the routing-engine via redis pub/sub.

In order to update mobilitypoints in redis you also need to run [mobilitypoint-worker](https://github.com/moovel/mobilitypoints-worker).
Make sure to run it on other port than routing-data-provider.

## Getting started

### Repositories and directory structure
 *	Acquire Permissions to access the github repositories:
 * [routing-engine](https://github.com/moovel/routing-engine)
 * [routing-data-provider](https://github.com/moovel/routing-data-provider)
 * [mobilitypoints-worker](https://github.com/moovel/mobilitypoints-worker)
* Create new directory where the repositories will be stored.(e.g routing_tool)
* clone repositories
   * *routing_tool / routing-engine*
   * *routing_tool / routing-data-provider*
   * *routing_tool / mobilitypoints-worker*


### Setup Dev Environment (Mac OS X)

* Java is required for some of the packages
* Install [nvm](https://github.com/creationix/nvm)

 ```
  $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
 ```
  * Follow the setup instructions to add nvm.sh to .zshrc, .bashrc or whatever you use.
  * Once installed, open a new terminal window or quit and reopen terminal.
  * Verify the installation of nvm by running the code below.

	```
    $ command -v nvm
    ```
   * will return ```nvm``` in the terminal window if installed correctly.
   * known Issue on OS X, if you get nvm: command not found after running the install script, your system may not have a [.bash_profile file] where the command is set up. Simply create one with ```$ touch ~/.bash_profile``` and run the install script again.
   * for any other issues or documentation consult the [nvm](https://github.com/creationix/nvm) webpage
* Install redis

 ```
 $ brew install redis
 ```
* Install maven for the routing-engine

 ```
 $ brew install maven
 ```

* Install node & npm & grunt

  ```
  $ nvm install v4.2.2
  $ nvm alias default v4.2.2
  $ npm install -g grunt-cli mocha node-inspector
  ```
* List globally installed packages

  ```
  $ npm list -g --depth=0
  ```

* Install dependencies
 * One of the packages requires a token to be installed. Token details to be shared on email request.
 * Once token is recieved, copy and paste into a text file and prepend //registry.npmjs.org/:_authToken=
 * save as .npmrc in your home user directory
* the code below must be run within the routing-data-provider directory

  ```
  $ npm install
  ```

* Create dev & test environment files from templates

  ```
  $ cp config/env/development.env.tmpl config/env/development.env
  $ cp config/env/test.env.tmpl config/env/test.env
  ```

* To pull the current configs from S3 for test, develpment and production environments 
  
  ```
  $ NODE_ENV=test npm run pull-config
  $ npm run pull-config
  $ NODE_ENV=production npm run pull-config
  ```

* If the config values change and you need to change then push the current configs to S3 for test, development and production environments 
  
  ```
  $ NODE_ENV=test npm run push-config
  $ npm run push-config
  $ NODE_ENV=production npm run push-config
  ```  

*  Setup Redis
 * locally with [redis](http://redis.io/topics/quickstart) quickstart docs
 * via AWS: routing-data-dev.t951qh.0001.euw1.cache.amazonaws.com Port 6379 (make sure you use VPN tunnel)

* Set variables in config/env/development.env and config/env/test.env accordingly

### Run redis

* start redis, can be run in terminal from any directory:
 ```
 $ redis-server /usr/local/etc/redis.conf
 ```
 * once successfully started redis will display the message : The server is now ready to accept connections on port 6379

### Run application locally for development

```
$ grunt dev
```

### Run tests

```
$ grunt test
```


## Linting

[ESLint](http://eslint.org/) is used for linting and executed in the background when running ```grunt dev``` or can explicitly be executed by calling

```
$ grunt eslint
```

See .eslintrc for ESLint config.

## Logging

Logstash logging via STDOUT is included and can be activated by setting these environment variables:

* LOGSTASH_ENABLED - activate logstash-formatting to STDOUT (set to "true"), if left out normal log-format is used


## Metrics / StatsD

Track response times and counts for response codes with StatsD by setting these environment variables:

* STATSD_HOST - the hostname or ip address of the StatsD server
* STATSD_PORT - the udp port StatsD in listening on


## Documentation

[JSDoc](http://usejsdoc.org/) is used for code documentation. It can be generated as HTML by executing the following grunt task:

```
$ grunt jsdoc
```


## Docker container

A basic Dockerfile is included to run the service bundled in a container.

Usage:

* Build docker image:
  ```
  $ docker build -t moovel/routing-data-provider .
  ```

* Run docker container:
  ```
  $ docker run -p 3000:3000 -d --restart=always moovel/routing-data-provider
  ```
  The service can now be accessed at http://$(boot2docker ip):3000/.



## Deployment

### Initial Deployment

Copy `deploy/config.env.tmpl` to `deploy/config.env` and adjust the values.

```
cd deploy
docker run \
  --workdir /deploy \
  -v $PWD:/deploy \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  moovel/aws-deploy:v0.0.2 \
  sh -c '(set -a; . ./config.env; /opt/aws/bin/create-service.sh)'
```

### Deploy new version

```
cd deploy
docker run \
  --workdir /deploy \
  -v $PWD:/deploy \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -e DOCKER_IMAGE=moovel/routing-data-provider:$VERSION \
  -e STACK_NAME=routing-data-provider-service-dev \
  moovel/aws-deploy:v0.0.2 \
  /opt/aws/bin/update-service.sh
```
