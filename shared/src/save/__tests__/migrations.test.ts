import { describe, expect, it } from 'vitest';
import { SAVE_PAYLOAD_VERSION } from '../../constants/index.js';
import { migrateSave, migrations } from '../migrations.js';

describe('migrateSave', () => {
  it('migre un payload sans version vers la version courante', () => {
    const result = migrateSave({});
    expect(result.payloadVersion).toBe(SAVE_PAYLOAD_VERSION);
  });

  it('est idempotent sur un payload deja a jour', () => {
    const fresh = migrateSave({ payloadVersion: SAVE_PAYLOAD_VERSION, foo: 'bar' });
    const reMigrated = migrateSave(fresh);
    expect(reMigrated).toEqual(fresh);
  });

  it('preserve les champs existants', () => {
    const result = migrateSave({ payloadVersion: 0, customField: 42 });
    expect(result.customField).toBe(42);
  });
});

describe('migrations registry', () => {
  it('expose une migration v1', () => {
    expect(typeof migrations[1]).toBe('function');
  });
});
