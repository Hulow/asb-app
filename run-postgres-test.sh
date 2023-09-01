docker-compose -f docker-compose.test.yml up -d
sleep 10s
export NODE_ENV="test"
npm run mig:run
