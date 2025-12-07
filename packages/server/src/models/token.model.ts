import prisma from '../prisma/client';

class TokenModel {
  public async add(userID: string, token: string): Promise<void> {
    await prisma.token.create({
      data: {
        userID,
        token,
      },
    });
  }

  public async remove(userID: string, token: string): Promise<void> {
    await prisma.token.delete({
      where: {
        userID_token: {
          userID,
          token,
        },
      },
    });
  }

  public async validate(userID: string, token: string): Promise<boolean> {
    let isValid = false;
    try {
      const row = await prisma.token.findUnique({
        where: {
          userID_token: {
            userID,
            token,
          },
        },
      });
      if (row) isValid = true;
    } catch (error) {
      console.error(error);
    }

    return isValid;
  }

  public async clearTokens(userID: string): Promise<void> {
    await prisma.token.deleteMany({
      where: {
        userID,
      },
    });
  }
}

export default new TokenModel();
