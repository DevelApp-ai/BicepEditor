import test from 'node:test';
import assert from 'node:assert/strict';
import { BicepModuleParser } from '../../dist-test/bicep-module-parser.js';

const SAMPLE = `// Storage Account module for testing
param storageAccountName string
param location string = resourceGroup().location
param sku string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
}

output storageAccountId string = storageAccount.id
output blobEndpoint string = storageAccount.properties.primaryEndpoints.blob
`;

test('parses parameters with and without defaults', () => {
  const parser = new BicepModuleParser();
  const meta = parser.parse('storage.bicep', SAMPLE, 'owner/repo/storage.bicep');
  assert.equal(meta.moduleName, 'storage');
  assert.equal(meta.parameters.length, 3);
  const [name, location, sku] = meta.parameters;
  assert.equal(name.required, true);
  assert.equal(location.required, false);
  assert.equal(sku.defaultValue, "'Standard_LRS'");
});

test('parses outputs and resources', () => {
  const parser = new BicepModuleParser();
  const meta = parser.parse('storage.bicep', SAMPLE, 'owner/repo/storage.bicep');
  assert.equal(meta.outputs.length, 2);
  assert.equal(meta.outputs[0].name, 'storageAccountId');
  assert.equal(meta.resources.length, 1);
  assert.equal(meta.resources[0].type, 'Microsoft.Storage/storageAccounts');
  assert.equal(meta.resources[0].apiVersion, '2021-04-01');
});

test('extracts leading comment as description', () => {
  const parser = new BicepModuleParser();
  const meta = parser.parse('storage.bicep', SAMPLE, 'src');
  assert.equal(meta.description, 'Storage Account module for testing');
});
