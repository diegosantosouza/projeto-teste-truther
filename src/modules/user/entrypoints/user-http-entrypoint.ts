import { Router } from 'express';
import { adaptRoute } from '@/shared/adapters';
import { makeUserCreateController, makeUserDeleteController, makeUserShowController, makeUserUpdateController } from '@/modules/user/factories';
import { makeUserListController } from '../factories/user-list-controller-factory';

export const userRouter = Router();

userRouter.get('/', adaptRoute(makeUserListController()));
userRouter.post('/', adaptRoute(makeUserCreateController()));
userRouter.get('/:id', adaptRoute(makeUserShowController()));
userRouter.patch('/:id', adaptRoute(makeUserUpdateController()));
userRouter.delete('/:id', adaptRoute(makeUserDeleteController()));
