import {
  CommonPreference,
  VersionedCommonPreference,
  BangumiDomain,
  MikanDomain,
} from 'bangumi-list-v3-shared';
import prisma from '../prisma/client';

const DEFAULT_COMMON_PREFERENCE: CommonPreference = {
  newOnly: false,
  watchingOnly: false,
  hoistWatching: false,
  bangumiDomain: BangumiDomain.BGM_TV,
  mikanDomain: MikanDomain.MIKANANI_ME,
};

class UserPreferenceModel {
  public async getCommon(
    userID: string
  ): Promise<VersionedCommonPreference | null> {
    if (!userID) throw new Error('User ID missing');
    const row = await prisma.preference.findFirst({
      where: {
        userID,
      },
    });
    if (!row) return null;
    try {
      return {
        ...DEFAULT_COMMON_PREFERENCE,
        ...JSON.parse(row.common),
        version: row.updatedAt.getTime() || 0,
      };
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
    const now = new Date();

    if (shouldCreateNew) {
      const newData = generateUpdatedData(updateData);
      const newDataString = JSON.stringify(newData);
      await prisma.preference.create({
        data: {
          userID,
          common: newDataString,
          createdAt: now,
          updatedAt: now,
        },
      });
      return { ...newData, version: now.getTime() };
    } else {
      const newData = generateUpdatedData({
        ...previousData,
        ...updateData,
      });
      const newDataString = JSON.stringify(newData);
      await prisma.preference.update({
        where: {
          userID,
        },
        data: {
          common: newDataString,
          updatedAt: now,
        },
      });
      return { ...newData, version: now.getTime() };
    }
  }

  public getDefaultPreference(): CommonPreference {
    return { ...DEFAULT_COMMON_PREFERENCE };
  }
}

function generateUpdatedData(
  newData: Partial<CommonPreference>
): CommonPreference {
  const updatedData: Record<string, unknown> = { ...DEFAULT_COMMON_PREFERENCE };
  for (const [key, value] of Object.entries(newData)) {
    if (!(key in updatedData)) continue;
    updatedData[key] = value;
  }
  return updatedData as CommonPreference;
}

export default new UserPreferenceModel();
