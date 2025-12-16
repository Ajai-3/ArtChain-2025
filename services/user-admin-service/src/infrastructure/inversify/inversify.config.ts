import 'reflect-metadata';
import { TYPES } from './types';
import { Container } from 'inversify';

// Repositories & Services
import { IArtService } from '../../application/interface/http/IArtService';
import { IUserRepository } from '../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../domain/repositories/user/ISupporterRepository';
import { IUserSearchRepository } from '../../domain/repositories/user/IUserSearchRepository';
import { IArtistRequestRepository } from '../../domain/repositories/user/IArtistRequestRepository';

import { ArtService } from '../http/ArtService';
import { UserRepositoryImpl } from '../repositories/user/UserRepositoryImpl';
import { SupporterRepositoryImpl } from '../repositories/user/SupporterRepositoryIml';
import { ArtistRequestRepositoryImpl } from '../repositories/user/ArtistRequestRepositoryImpl';
import { ElasticUserSearchRepositoryImpl } from '../repositories/user/ElasticUserSearchRepositoryImpl';

// Use cases - Artist Request
import { CreateArtistRequestUseCase } from '../../application/usecases/user/artist-request/CreateArtistRequestUseCase';
import { CheckUserArtistRequestUseCase } from '../../application/usecases/user/artist-request/CheckUserArtistRequestUseCase';
import { ICreateArtistRequestUseCase } from '../../application/interface/usecases/user/artist-request/ICreateArtistRequestUseCase';
import { ICheckUserArtistRequestUseCase } from '../../application/interface/usecases/user/artist-request/ICheckUserArtistRequestUseCase';

// Use cases - Security
import { ChangeEmailUserUseCase } from '../../application/usecases/user/security/ChangeEmailUserUseCase';
import { ChangePasswordUserUseCase } from '../../application/usecases/user/security/ChangePasswordUserUseCase';
import { VerifyEmailTokenUserUseCase } from '../../application/usecases/user/security/VerifyEmailTokenUserUseCase';
import { IChangeEmailUserUseCase } from '../../application/interface/usecases/user/security/IChangeEmailUserUseCase';
import { IChangePasswordUserUseCase } from '../../application/interface/usecases/user/security/IChangePasswordUserUseCase';
import { IVerifyEmailTokenUserUseCase } from '../../application/interface/usecases/user/security/IVerifyEmailTokenUserUseCase';

// Use cases - Auth
import { ILoginUserUseCase } from '../../application/interface/usecases/user/auth/ILoginUserUseCase';
import { IRefreshTokenUseCase } from '../../application/interface/usecases/user/auth/IRefreshTokenUseCase';
import { IRegisterUserUseCase } from '../../application/interface/usecases/user/auth/IRegisterUserUseCase';
import { IGoogleAuthUserUseCase } from '../../application/interface/usecases/user/auth/IGoogleAuthUserUseCase';
import { IResetPasswordUserUseCase } from '../../application/interface/usecases/user/auth/IResetPasswordUserUseCase';
import { IStartRegisterUserUseCase } from '../../application/interface/usecases/user/auth/IStartRegisterUserUseCase';
import { IForgotPasswordUserUseCase } from '../../application/interface/usecases/user/auth/IForgotPasswordUserUseCase';
import { IAddUserToElasticSearchUseCase } from '../../application/interface/usecases/user/search/IAddUserToElasticSearchUseCase';

import { LoginUserUseCase } from '../../application/usecases/user/auth/LoginUserUseCase';
import { RegisterUserUseCase } from '../../application/usecases/user/auth/RegisterUserUseCase';
import { GoogleAuthUserUseCase } from '../../application/usecases/user/auth/GoogleAuthUserUseCase';
import { RefreshTokenUserUseCase } from '../../application/usecases/user/auth/RefreshTokenUserUseCase';
import { ResetPasswordUserUseCase } from '../../application/usecases/user/auth/ResetPasswordUserUseCase';
import { StartRegisterUserUseCase } from '../../application/usecases/user/auth/StartRegisterUserUseCase';
import { ForgotPasswordUserUseCase } from '../../application/usecases/user/auth/ForgotPasswordUserUseCase';
import { AddUserToElasticSearchUseCase } from '../../application/usecases/user/search/AddUserToElasticSearchUseCase';

// Use cases - User Profile & Interaction
import { IGetUserProfileUseCase } from '../../application/interface/usecases/user/profile/IGetUserProfileUseCase';
import { ISupportUserUseCase } from '../../application/interface/usecases/user/user-intraction/ISupportUserUseCase';
import { IUpdateProfileUserUseCase } from '../../application/interface/usecases/user/profile/IUpdateProfileUserUseCase';
import { IUnSupportUserUseCase } from '../../application/interface/usecases/user/user-intraction/IUnSupportUserUseCase';
import { IGetUserWithIdUserUseCase } from '../../application/interface/usecases/user/profile/IGetUserWithIdUserUseCase';
import { IGetUsersByIdsUserUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase';
import { IGetUserSupportersUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUserSupportersUseCase';
import { IGetUserSupportingUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUserSupportingUseCase';

import { GetUserProfileUseCase } from '../../application/usecases/user/profile/GetProfileUserUseCase';
import { SupportUserUseCase } from '../../application/usecases/user/user-intraction/SupportUserUseCase';
import { UnSupportUserUseCase } from '../../application/usecases/user/user-intraction/UnSupportUserUseCase';
import { GetUserWithIdUserUseCase } from '../../application/usecases/user/profile/GetUserWithIdUserUseCase';
import { UpdateProfileUserUseCase } from '../../application/usecases/user/profile/UpdateProfileUserUseCase';
import { GetUsersByIdsUserUseCase } from '../../application/usecases/user/user-intraction/GetUsersByIdsUserUseCase';
import { GetUserSupportersUseCase } from '../../application/usecases/user/user-intraction/GetUserSupportersUseCase';
import { GetUserSupportingUseCase } from '../../application/usecases/user/user-intraction/GetUserSupportingUseCase';

// Admin Use Cases
import { ILoginAdminUseCase } from '../../application/interface/usecases/admin/auth/ILoginAdminUseCase';
import { IGetAllUsersUseCase } from '../../application/interface/usecases/admin/user-management/IGetAllUsersUseCase';
import { IBanOrUnbanUserUseCase } from '../../application/interface/usecases/admin/user-management/IBanOrUnbanUserUseCase';
import { IRejectArtistRequestUseCase } from '../../application/interface/usecases/admin/user-management/IRejectArtistRequestUseCase';
import { IGetAllArtistRequestsUseCase } from '../../application/interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase';
import { IApproveArtistRequestUseCase } from '../../application/interface/usecases/admin/user-management/IApproveArtistRequestUseCase';

import { LoginAdminUseCase } from '../../application/usecases/admin/auth/LoginAdminUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/admin/user-management/GetAllUsersUseCase';
import { BanOrUnbanUserUseCase } from '../../application/usecases/admin/user-management/BanOrUnbanUserUseCase';
import { GetAllArtistRequestsUseCase } from '../../application/usecases/admin/user-management/GetAllArtistRequests';
import { RejectArtistRequestUseCase } from '../../application/usecases/admin/user-management/RejectArtistRequestUseCase';
import { ApproveArtistRequestUseCase } from './../../application/usecases/admin/user-management/ApproveArtistRequestUseCase';

// Controllers
import { IUserController } from '../../presentation/interfaces/user/IUserController';
import { ISecurityController } from '../../presentation/interfaces/user/ISecurityController';
import { IUserAuthController } from '../../presentation/interfaces/user/IUserAuthController';
import { IArtistRequestController } from '../../presentation/interfaces/user/IArtistRequestController';

import { UserController } from '../../presentation/controllers/user/UserController';
import { SecurityController } from '../../presentation/controllers/user/SecurityController';
import { UserAuthController } from '../../presentation/controllers/user/UserAuthController';
import { ArtistRequestController } from '../../presentation/controllers/user/ArtistRequestController';

// Admin controller
import { IAdminAuthController } from '../../presentation/interfaces/admin/IAdminAuthController';
import { IUserManageMentController } from '../../presentation/interfaces/admin/IUserManagementController';

import { AdminAuthController } from '../../presentation/controllers/admin/AdminAuthController';
import { UserManageMentController } from './../../presentation/controllers/admin/UserManagementController';

// Report
import { IReportRepository } from '../../domain/repositories/user/IReportRepository';
import { ReportRepository } from '../repositories/user/ReportRepository';
import { ICreateReportUseCase } from '../../application/interface/usecases/user/report/ICreateReportUseCase';
import { CreateReportUseCase } from '../../application/usecases/user/report/CreateReportUseCase';
import { IReportController } from '../../presentation/interfaces/user/IReportController';
import { ReportController } from '../../presentation/controllers/user/ReportController';
import { IGetAllReportsUseCase } from '../../application/interface/usecases/admin/report/IGetAllReportsUseCase';
import { GetAllReportsUseCase } from '../../application/usecases/admin/report/GetAllReportsUseCase';
import { IGetGroupedReportsUseCase } from '../../application/interface/usecases/admin/report/IGetGroupedReportsUseCase';
import { GetGroupedReportsUseCase } from '../../application/usecases/admin/report/GetGroupedReportsUseCase';
import { IUpdateReportStatusBulkUseCase } from '../../application/interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';
import { UpdateReportStatusBulkUseCase } from '../../application/usecases/admin/report/UpdateReportStatusBulkUseCase';
import { IAdminReportController } from '../../presentation/interfaces/admin/IAdminReportController';
import { AdminReportController } from '../../presentation/controllers/admin/AdminReportController';

// Dashboard
import { IWalletService } from '../../application/interface/http/IWalletService';
import { WalletService } from '../http/WalletService';
import { IGetPlatformRevenueStatsUseCase } from '../../application/interface/usecase/admin/IGetPlatformRevenueStatsUseCase';
import { GetPlatformRevenueStatsUseCase } from '../../application/usecases/admin/dashboard/GetPlatformRevenueStatsUseCase';
import { IAdminDashboardController } from '../../presentation/interfaces/admin/IAdminDashboardController';
import { AdminDashboardController } from '../../presentation/controllers/admin/AdminDashboardController';


const container = new Container();

// Repositories & Services
container
.bind<IArtService>(TYPES.IArtService)
  .to(ArtService)
  .inSingletonScope();
container
  .bind<IUserRepository>(TYPES.IUserRepository)
  .to(UserRepositoryImpl)
  .inSingletonScope();
container
  .bind<IUserSearchRepository>(TYPES.IUserSearchRepository)
  .to(ElasticUserSearchRepositoryImpl)
  .inSingletonScope();
container
  .bind<ISupporterRepository>(TYPES.ISupporterRepository)
  .to(SupporterRepositoryImpl)
  .inSingletonScope();
container
  .bind<IArtistRequestRepository>(TYPES.IArtistRequestRepository)
  .to(ArtistRequestRepositoryImpl)
  .inSingletonScope();

// Use cases - Artist Request
container
  .bind<ICreateArtistRequestUseCase>(TYPES.ICreateArtistRequestUseCase)
  .to(CreateArtistRequestUseCase);
container
  .bind<ICheckUserArtistRequestUseCase>(TYPES.ICheckUserArtistRequestUseCase)
  .to(CheckUserArtistRequestUseCase);

// Use cases - Security
container
  .bind<IChangePasswordUserUseCase>(TYPES.IChangePasswordUserUseCase)
  .to(ChangePasswordUserUseCase);
container
  .bind<IChangeEmailUserUseCase>(TYPES.IChangeEmailUserUseCase)
  .to(ChangeEmailUserUseCase);
container
  .bind<IVerifyEmailTokenUserUseCase>(TYPES.IVerifyEmailTokenUserUseCase)
  .to(VerifyEmailTokenUserUseCase);

// Use cases - Auth
container
  .bind<IStartRegisterUserUseCase>(TYPES.IStartRegisterUserUseCase)
  .to(StartRegisterUserUseCase);
container
  .bind<IRegisterUserUseCase>(TYPES.IRegisterUserUseCase)
  .to(RegisterUserUseCase);
container.bind<ILoginUserUseCase>(TYPES.ILoginUserUseCase).to(LoginUserUseCase);
container
  .bind<IGoogleAuthUserUseCase>(TYPES.IGoogleAuthUserUseCase)
  .to(GoogleAuthUserUseCase);
container
  .bind<IForgotPasswordUserUseCase>(TYPES.IForgotPasswordUserUseCase)
  .to(ForgotPasswordUserUseCase);
container
  .bind<IResetPasswordUserUseCase>(TYPES.IResetPasswordUserUseCase)
  .to(ResetPasswordUserUseCase);
container
  .bind<IRefreshTokenUseCase>(TYPES.IRefreshTokenUseCase)
  .to(RefreshTokenUserUseCase);
container
  .bind<IAddUserToElasticSearchUseCase>(TYPES.IAddUserToElasticSearchUseCase)
  .to(AddUserToElasticSearchUseCase);

// Use cases - User Profile & Interaction
container
  .bind<ISupportUserUseCase>(TYPES.ISupportUserUseCase)
  .to(SupportUserUseCase);
container
  .bind<IUnSupportUserUseCase>(TYPES.IUnSupportUserUseCase)
  .to(UnSupportUserUseCase);
container
  .bind<IGetUserWithIdUserUseCase>(TYPES.IGetUserWithIdUseCase)
  .to(GetUserWithIdUserUseCase);
container
  .bind<IGetUsersByIdsUserUseCase>(TYPES.IGetUsersByIdsUseCase)
  .to(GetUsersByIdsUserUseCase);
container
  .bind<IGetUserProfileUseCase>(TYPES.IGetUserProfileUseCase)
  .to(GetUserProfileUseCase);
container
  .bind<IGetUserSupportersUseCase>(TYPES.IGetUserSupportersUseCase)
  .to(GetUserSupportersUseCase);
container
  .bind<IGetUserSupportingUseCase>(TYPES.IGetUserSupportingUseCase)
  .to(GetUserSupportingUseCase);
container
  .bind<IUpdateProfileUserUseCase>(TYPES.IUpdateProfileUserUseCase)
  .to(UpdateProfileUserUseCase);

// Admin Use cases
// Admin Auth
container
  .bind<ILoginAdminUseCase>(TYPES.ILoginAdminUseCase)
  .to(LoginAdminUseCase);

// User Management Use Cases
container
  .bind<IGetAllUsersUseCase>(TYPES.IGetAllUsersUseCase)
  .to(GetAllUsersUseCase);
container
  .bind<IBanOrUnbanUserUseCase>(TYPES.IBanOrUnbanUserUseCase)
  .to(BanOrUnbanUserUseCase);
container
  .bind<IRejectArtistRequestUseCase>(TYPES.IRejectArtistRequestUseCase)
  .to(RejectArtistRequestUseCase);
container
  .bind<IApproveArtistRequestUseCase>(TYPES.IApproveArtistRequestUseCase)
  .to(ApproveArtistRequestUseCase);
container
  .bind<IGetAllArtistRequestsUseCase>(TYPES.IGetAllArtistRequestsUseCase)
  .to(GetAllArtistRequestsUseCase);

// Controllers
container.bind<IUserController>(TYPES.IUserController).to(UserController);
container
  .bind<ISecurityController>(TYPES.ISecurityController)
  .to(SecurityController);
container
  .bind<IUserAuthController>(TYPES.IUserAuthController)
  .to(UserAuthController);
container
  .bind<IArtistRequestController>(TYPES.IArtistRequestController)
  .to(ArtistRequestController);

// Admin Controller
container
  .bind<IAdminAuthController>(TYPES.IAdminAuthController)
  .to(AdminAuthController);
container
  .bind<IUserManageMentController>(TYPES.IUserManageMentController)
  .to(UserManageMentController);

// Report
container.bind<IReportRepository>(TYPES.IReportRepository).to(ReportRepository).inSingletonScope();
container.bind<ICreateReportUseCase>(TYPES.ICreateReportUseCase).to(CreateReportUseCase);
container.bind<IGetAllReportsUseCase>(TYPES.IGetAllReportsUseCase).to(GetAllReportsUseCase);
container.bind<IGetGroupedReportsUseCase>(TYPES.IGetGroupedReportsUseCase).to(GetGroupedReportsUseCase);
container.bind<IUpdateReportStatusBulkUseCase>(TYPES.IUpdateReportStatusBulkUseCase).to(UpdateReportStatusBulkUseCase);
container.bind<IReportController>(TYPES.IReportController).to(ReportController);
container.bind<IAdminReportController>(TYPES.IAdminReportController).to(AdminReportController);

// Dashboard
container.bind<IWalletService>(TYPES.IWalletService).to(WalletService).inSingletonScope();
container.bind<IGetPlatformRevenueStatsUseCase>(TYPES.IGetPlatformRevenueStatsUseCase).to(GetPlatformRevenueStatsUseCase);
container.bind<IAdminDashboardController>(TYPES.IAdminDashboardController).to(AdminDashboardController);

export { container };
