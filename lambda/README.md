Install node via nvm.

```
nvm install
nvm use
```

Install the right version of the serverless framework.

```
npm install -g serverless@1.2.0
```

Create the *.env* file based on the *.env.tplt* template.

# Deployment

## Development

```
sls deploy
```

## Production

Edit serverless.yml and set *stage* to *prod*.

Edit src/config.js and set *environment* to *prod*.

```
sls deploy
```

**Note:** During the first deployment, NotificationConfiguration section will
need to be commented out for all S3 buckets.  After a successful deployment they
can be uncommented and the deployment will complete.  When setting up a
notification, the target of each notification is tested, and for some reason
they are not available at the start.  Perhaps a circular dependency or a race
condition.
