# NodeJS GraphQL DynamoDB

### Description
An exemplary implementation of GraphQL API and AWS DynamoDB. API contains two endpoints:
1. Query configurations(userId) - lets retrieve configurations related to custom userId.
2. Mutation saveConfigurations(api, name, userId) - lets to save configuration in database
Exemplary query and mutation can be found in unit tests spec(test/Configuration.spec.ts).

### Runing the workflow
1. Install dependencies and build using `npm install`.
2. Copy `example.env` as `.env` and update it according to details of a target DynamoDB.
3. Run yoga server using `npm start`.
4. GraphQL Playground will be available on [http://localhost:4000](http://localhost:4000). API will be available for external clients on [http://localhost:4000/graphql](http://localhost:4000/graphql).
5. To re-build the server use `npm build`.

### Unit tests
1. Install dependencies and build using `npm install`.
2. Copy `example.env` as `.env`.
1. Run yoga server using `npm start`.
2. [Install Docker Compose](https://docs.docker.com/compose/install/), run the Docker and update `.env/DYNAMODB_URL` with `Docker default machine IP`:4569, e.g. `SQS_URL=http://localhost:4569`
3. Run the Local Stack by command: `npm run startLocalStack`
4. Create a DynamoDB table by [AWS CLI](https://docs.aws.amazon.com/cli/latest/index.html) command: `aws --endpoint-url=http://192.168.99.100:4569 dynamodb create-table --table-name configuration --attribute-definitions AttributeName=id,AttributeType=S AttributeName=userId,AttributeType=S AttributeName=name,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --global-secondary-indexes "[{\"IndexName\": \"userId-index\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5 },\"Projection\":{\"ProjectionType\":\"ALL\"}}, {\"IndexName\": \"name-index\",\"KeySchema\":[{\"AttributeName\":\"name\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5 },\"Projection\":{\"ProjectionType\":\"ALL\"}}]" --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5`.
In above command, use you Docker machine IP(eg http://localhost or http://192.168.99.100).
3. To run unit tests execute `npm test`.

### Notes:
1. GraphQL will be created when API will be started.
2. Implemented based on [graphql-api](https://github.com/DariuszWietecha/graphql-api)
3. During the implemented was used node v10.16.3.