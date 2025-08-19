import { Request, Response } from 'express';
import { IndexedUser } from '../../../types/IndexedUser';

export class ElasticUserController {
  constructor(private _searchUserUseCase: any) {}

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = (req.query.q as string)?.trim();;

      if (!query) {
        res.status(400).json({ message: 'Query is required' });
        return;
      }

      const users: IndexedUser[] = await this._searchUserUseCase.searchUsers(query);
      res.status(200).json(users);
    } catch (error: any) {
      console.error('Error searching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
