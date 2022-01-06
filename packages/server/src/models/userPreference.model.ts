import {
  CommonPreference,
  VersionedCommonPreference,
  BangumiDomain,
} from 'bangumi-list-v3-shared';
import db from '../db';

const DEFAULT_COMMON_PREFERENCE: CommonPreference = {
  newOnly: false,
  watchingOnly: false,
  hoistWatching: false,
  bangumiDomain: BangumiDomain.BGM_TV,
};

class UserPreferenceModel {
  private tableName = 'preference';

  public async initDB() {
    await db.run(`
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      user_id TEXT PRIMARY KEY,
      common TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    ) WITHOUT ROWID;`);
  }

  public async getCommon(
    userID: string
  ): Promise<VersionedCommonPreference | null> {
    if (!userID) throw new Error('User ID missing');
    const row = await db.get(
      `SELECT * FROM ${this.tableName} WHERE user_id = $userID`,
      {
        $userID: userID,
      }
    );
    if (!row) return null;
    try {
      return { ...JSON.parse(row.common), version: row.updated_at || 0 };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async updateCommon(
    userID: string,
    updateData: Partial<CommonPreference>
  ): Promise<VersionedCommonPreference> {
    if (!userID) throw new Error('User ID missing');
    const previousData = await this.getCommon(userID);
    const shouldCreateNew = previousData === null;
    const now = Date.now();

    if (shouldCreateNew) {
      const newData = generateUpdatedData(updateData);
      const newDataString = JSON.stringify(newData);
      await db.run(
        `
        INSERT INTO ${this.tableName} (user_id, common, created_at, updated_at)
        VALUES($userID, $data, $createdAt, $updatedAt);
      `,
        {
          $userID: userID,
          $data: newDataString,
          $createdAt: now,
          $updatedAt: now,
        }
      );
      return { ...newData, version: now };
    } else {
      const newData = generateUpdatedData({
        ...previousData,
        ...updateData,
      });
      const newDataString = JSON.stringify(newData);
      await db.run(
        `
        UPDATE ${this.tableName}
        SET
          common = $data,
          updated_at = $updatedAt
        WHERE
          user_id = $userID
      `,
        {
          $data: newDataString,
          $updatedAt: now,
          $userID: userID,
        }
      );
      return { ...newData, version: now };
    }
  }

  public getDefaultPreference(): CommonPreference {
    return { ...DEFAULT_COMMON_PREFERENCE };
  }
}

function generateUpdatedData(
  newData: Partial<CommonPreference>
): CommonPreference {
  const updatedData: any = { ...DEFAULT_COMMON_PREFERENCE };
  for (const [key, value] of Object.entries(newData)) {
    if (!(key in updatedData)) continue;
    updatedData[key] = value;
  }
  return updatedData as CommonPreference;
}

export default new UserPreferenceModel();
