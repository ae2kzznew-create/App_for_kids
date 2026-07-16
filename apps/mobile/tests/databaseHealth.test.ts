import assert from "node:assert/strict";
import test from "node:test";
import { readDatabaseHealth, verifyDatabaseHealth, type DatabaseHealthStore } from "../src/storage/databaseHealth";

class FakeDatabaseHealthStore implements DatabaseHealthStore {
  private readonly values = new Map<string, string>();

  async getFirstAsync<T>(_: string, ...params: Array<string | number>) {
    const key = String(params[0]);
    const value = this.values.get(key);
    return value ? ({ value } as T) : null;
  }

  async getAllAsync<T>(_: string, ...params: Array<string | number>) {
    return params.flatMap((param) => {
      const key = String(param);
      const value = this.values.get(key);
      return value ? ([{ key, value }] as T[]) : [];
    });
  }

  async runAsync(_: string, ...params: Array<string | number>) {
    this.values.set(String(params[0]), String(params[1]));
  }

  async withTransactionAsync<T>(callback: () => Promise<T>) {
    return callback();
  }
}

test("verifyDatabaseHealth persists current and previous startup markers", async () => {
  const store = new FakeDatabaseHealthStore();

  const first = await verifyDatabaseHealth(store);
  assert.ok(first.lastSuccessfulStart);
  assert.equal(first.previousSuccessfulStart, null);
  assert.equal(first.persistenceVerified, false);

  const second = await verifyDatabaseHealth(store);
  assert.equal(second.previousSuccessfulStart, first.lastSuccessfulStart);
  assert.equal(second.persistenceVerified, true);

  const readBack = await readDatabaseHealth(store);
  assert.equal(readBack.previousSuccessfulStart, first.lastSuccessfulStart);
  assert.equal(readBack.persistenceVerified, true);
});
