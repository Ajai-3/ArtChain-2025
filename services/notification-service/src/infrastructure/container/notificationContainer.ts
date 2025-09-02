import { GetUserNotificationsUseCase } from './../../application/usecases/GetUserNotificationsUseCase';
import { NotificationController } from "../../presentation/controllers/NotificationController";
import { NotificationRepositoryImp } from "../repositories/NotificationRepositoryImp";
import { GetUnreadCountUseCase } from '../../application/usecases/GetUnreadCountUseCase';
import { MarkAsReadUseCase } from '../../application/usecases/MarkAsReadUseCase';
import { MarkAllAsReadUseCase } from '../../application/usecases/MarkAllAsReadUseCase';

// Repositories
const repo = new NotificationRepositoryImp()

// Use Cases
const getUserNotificationsUseCase = new GetUserNotificationsUseCase(repo)
const getUnreadCountUseCase = new GetUnreadCountUseCase(repo)
const markAsReadUseCase = new MarkAsReadUseCase(repo)
const markAllAsReadUseCase = new MarkAllAsReadUseCase(repo)

// Controller
export const notificationContainer = new NotificationController(
    getUserNotificationsUseCase,
    getUnreadCountUseCase,
    markAsReadUseCase,
    markAllAsReadUseCase

)