import { expect } from "chai";
import request from "supertest";

describe("Configuration", () => {
  const req = request("http://localhost:4000");
  const graphqlPath = "/graphql";
  const configInput = {
    api: {
      host: "test.example.com",
      key: "test154721e2b8000cded4b4",
      protocol: "https",
      secret: "testRyHiuAAM3tS08U6r7YeJUUA0cA00",
    },
    name: "saved config",
    userId: "2c5ea4c0-4067-11e9-8b2d-1b9d6bcdbbfd",
  };

  it("mutation, saveConfigurations", async () => {
    const saveConfigurationsRes = await req.post(graphqlPath)
      .send({
        query: `
         mutation saveConfigurations($userId: String!, $name: String!, $api: ApiInput!) {
          saveConfigurations(userId: $userId, name: $name, api: $api) {
            id,
            name,
            userId,
            api{
              host,
              key,
              protocol,
              secret
            }
          }
        }
         `,
        variables: configInput,
      })
      .expect(200)
      .then((res) => res.body.data.saveConfigurations);

    expect(saveConfigurationsRes.api).to.be.deep.eq(configInput.api);
    expect(typeof saveConfigurationsRes.id).to.be.eq("string");
    expect(saveConfigurationsRes.name).to.be.eq(configInput.name);
    expect(saveConfigurationsRes.userId).to.be.eq(configInput.userId);
  });

  it("query, getConfigurations", async () => {
    await req.post(graphqlPath)
      .send({
        query: `
         mutation saveConfigurations($userId: String!, $name: String!, $api: ApiInput!) {
          saveConfigurations(userId: $userId, name: $name, api: $api) {
            id,
            name,
            userId,
            api{
              host,
              key,
              protocol,
              secret
            }
          }
        }
         `,
        variables: configInput,
      });

    const configurations = await req.post(graphqlPath)
      .send({
        query: `{
          configurations(userId: "${configInput.userId}") {
            id,
            name,
            userId,
            api {
                host,
                key,
                protocol,
                secret
              }
            }
          }`})
      .expect(200)
      .then((res) => res.body.data.configurations);

    expect(configurations.length).to.be.gt(0);
    expect(typeof configurations[0].id).to.be.eq("string");
    expect(configurations[0].name).to.be.eq(configInput.name);
    expect(configurations[0].userId).to.be.eq(configInput.userId);
    expect(configurations[0].api).to.be.deep.eq(configInput.api);
  });
});
