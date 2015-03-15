# What is it?

Shamvelo is a simple application for allowing a small group of friends to share and compare Strava statistics.  It is a Node.js/MongoDB application that uses OAuth authorisation to register and retrieve athlete details from the Strava API, and then stores the data in a local database for analysis and summary.  All interaction is via a web interface.

# Requirements

Docker - The application is packaged into Docker containers, so requires a Linux server with the Docker daemon running.  For Windows and OSX, try Boot2Docker.
Docker Compose - Multiple docker containers are linked together using Docker Compose (a.k.a. Fig).

# Installation

## Required Steps

Clone the repository locally.

  git clone git@github.com:brettch/shamvelo.git

Build the docker images.

  fig build

Copy env.sh.tplt to env.sh.

  cp env.sh.tplt env.sh

Edit env.sh and modify the variables to suit your environment.

Start the application.

  fig up

## Optional Steps

### Expose via Apache Web Server

To expose the application via an existing Apache Web Server, use the following configuration snippet.

    ProxyPass /shamvelo http://localhost:8080
    ProxyPassReverse /shamvelo http://localhost:8080
  
    <Location /shamvelo>
            SSLRequireSSL
  
            AuthType Basic
            AuthName "Shamvelo Realm"
            AuthUserFile /etc/httpd/conf.d/passwd
  
            Require valid-user
    </Location>

This snippet should be placed in its own file.  For example, on Fedora an appropriate location is /etc/httpd/conf.d/shamvelo.conf.

The config limits access to users defined in the /etc/httpd/conf.d/passwd file.

If port 8080 is already in use, the port number must be changed in the Apache config, and in the application fig.yml.

# Licencing
