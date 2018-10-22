cd ../../app/bank-frontend
yarn install
yarn build

cd ../../docker/frontend

docker build -f ../../app/bank-frontend/Dockerfile -t cgi/hacsec-frontend:0.0.1 ../../app/bank-frontend
