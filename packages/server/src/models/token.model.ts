import db from '../db';

class TokenModel {
  private tableName = 'tokens';

  public async initDB() {
    await db.run(`
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      PRIMARY KEY (user_id, token)
    ) WITHOUT ROWID;`);
  }

  public async add(userID: string, token: string): Promise<void> {
    await db.run(
      `
      INSERT INTO ${this.tableName} (user_id, token)
      VALUES ($userID, $token);
    `,
      {
        $userID: userID,
        $token: token,
      }
    );
  }

  public async remove(userID: string, token: string): Promise<void> {
    await db.run(
      `
      DELETE FROM ${this.tableName}
      WHERE
        user_id = $userID
        AND token = $token;
    `,
      {
        $userID: userID,
        $token: token,
      }
    );
  }

  public async validate(userID: string, token: string): Promise<boolean> {
    let isValid = false;
    try {
      const row = await db.get(
        `
        SELECT *
        FROM ${this.tableName}
        WHERE
          user_id = $userID
          AND token = $token;
      `,
        {
          $userID: userID,
          $token: token,
        }
      );
      if (row) isValid = true;
    } catch (error) {
      console.error(error);
    }

    return isValid;
  }

  public async clearTokens(userID: string): Promise<void> {
    await db.run(
      `
      DELETE FROM ${this.tableName}
      WHERE
        user_id = $userID
    `,
      {
        $userID: userID,
      }
    );
  }
}

export default new TokenModel();
