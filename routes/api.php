<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Api\BoardMemberController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\PaymentScheduleController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\UserPaymentController;
use App\Http\Controllers\AdminPaymentController;

Route::get('/feedbackIndex', [FeedbackController::class, 'index']);
Route::post('/feedback', [FeedbackController::class, 'store']);



Route::get('/contact-show', [ContactInfoController::class, 'show']);
Route::post('/contact-store', [ContactInfoController::class, 'store']);
Route::put('/contact-update', [ContactInfoController::class, 'update']);

Route::middleware('api')->group(function () {
    Route::get('/getschedules', [PaymentScheduleController::class, 'index']);
    Route::get('/account-holders/{user_id}/schedules', [PaymentScheduleController::class, 'fetchUserSchedules']);
});

Route::apiResource('galleries', GalleryController::class);
Route::get('/gallery/latestImages', [GalleryController::class, 'latestImages']);
Route::get('/gallery/allImages', [GalleryController::class, 'allImages']);

Route::get('/fetch-account-holders', [PaymentScheduleController::class, 'fetchaccountholders']);
Route::post('/schedule', [PaymentScheduleController::class, 'store']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/payment-schedules/family/{familyId}', [PaymentScheduleController::class, 'getFamilySchedules']);
    Route::get('/payment-schedules/user/{userId}', [PaymentScheduleController::class, 'getUserSchedules']);
});

// Family routes
Route::get('/families/{block}-{lot}', [FamilyController::class, 'getFamilyDetails']);
Route::get('/families/tenants/{block}-{lot}', [FamilyController::class, 'getFamilyTenantDetails']);
Route::put('/families/{familyId}/account-holder', [FamilyController::class, 'updateAccountHolder']);


// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/auth/status', [AuthController::class, 'status']);


// Registration routes
Route::middleware('web')->group(function () {
    Route::post('/register/step1', [RegisterController::class, 'registerStep1']);
    Route::post('/register/step2', [RegisterController::class, 'registerStep2']);
    Route::post('/register/step3', [RegisterController::class, 'registerStep3']);
});

// User routes (protected with auth middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/pending', [UserController::class, 'index']);
    Route::get('/users/approved', [UserController::class, 'approvedUsers']);
    Route::post('/users/approve/{userId}', [UserController::class, 'approve']);
    Route::post('/users/reject/{userId}', [UserController::class, 'reject']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{userId}', [UserController::class, 'update']);
    Route::post('/users/{userId}/update-email-username', [UserController::class, 'updateEmailAndUsername']);
    Route::delete('/users/{userId}', [UserController::class, 'delete']);
    Route::get('/approved-users/gender-count', [UserController::class, 'getApprovedUsersCountByGender']);
    Route::post('/users/{userId}/update-profile-picture', [UserController::class, 'uploadAvatar']);
    Route::post('/update-password', [UserController::class, 'updatePassword']);
    Route::get('/users/me', [UserController::class, 'me']);
    Route::post('/change-password', [UserController::class, 'ChangePassword']);
    Route::get('/user/profile', [UserController::class, 'getUserProfile']);
});

Route::post('/check-email', [UserController::class, 'checkEmail']);

// Board members routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/board-members', [BoardMemberController::class, 'store']);
    Route::post('/board-members/{id}', [BoardMemberController::class, 'update']);
    Route::delete('/board-members/{id}', [BoardMemberController::class, 'destroy']);
});


Route::middleware('api')->group(function () {
    Route::post('/upload-residents', [ResidentController::class, 'upload']);
    Route::get('/residents', [ResidentController::class, 'getResidents']);
});


// Announcements routes
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);
Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
Route::post('/announcements/{id}/increment-views', [AnnouncementController::class, 'incrementViews']);
Route::get('/board-members', [BoardMemberController::class, 'getBoardMembers']);
Route::get('/latest', [AnnouncementController::class, 'latest']);

// Notification routes (protected with auth middleware)

// Forgot Password Routes
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']); 

// Reset Password Routes
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);
// Fallback route

Route::get('/blocks', [NotificationController::class, 'getBlocks']);
Route::get('/notifications/all-users', [NotificationController::class, 'getAllUsers']);
Route::get('/notifications/{id}', [NotificationController::class, 'getNotifications']);
Route::get('/notifications', [NotificationController::class, 'getAllNotifications']);
Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::post('/send-notification', [NotificationController::class, 'sendNotification']);  


Route::post('/new-payment', [PaymentController::class, 'create']);
Route::get('/account-holders', [PaymentController::class, 'accountHolders']);
Route::get('/payments/recent/{userId}', [PaymentController::class, 'showRecentPayment']);
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/pending-payments', [PaymentController::class, 'pendingPayments']);
Route::patch('/payments/{payment}/approve', [PaymentController::class, 'approveProofOfPayment']);
Route::patch('/payments/{payment}/reject', [PaymentController::class, 'reject']);
Route::post('/payments/proof-of-payment', [PaymentController::class, 'storeProofOfPayment']);

Route::get('/user/active-years', [UserPaymentController::class, 'getActivatedYears']);
Route::get('/user/{user}/payments/{year}', [UserPaymentController::class, 'getPaymentsByYear']);
Route::post('/user/{user}/payments', [UserPaymentController::class, 'addPayment']);

Route::get('/pending-payments', [UserPaymentController::class, 'getPendingPayments']);
Route::get('/approved-payments', [UserPaymentController::class, 'getApprovedPayments']);
Route::get('/rejected-payments', [UserPaymentController::class, 'getRejectedPayments']);
Route::post('/admin/payments/approve', [UserPaymentController::class, 'approvePayment']);
Route::post('/admin/payments/reject', [UserPaymentController::class, 'rejectPayment']);
Route::get('/admin/delayed-payments', [UserPaymentController::class, 'getDelayedPayments']);

Route::get('/blocks-lots', [ResidentController::class, 'getBlockAndLot']);
Route::post('/blocks-lots', [ResidentController::class, 'newBlockLot']);
Route::put('/blocks-lots/{id}', [ResidentController::class, 'updateBlockLot']);
Route::delete('/blocks-lots/{id}', [ResidentController::class, 'deleteBlockLot']);
Route::get('/blocks-lots/occupancy-status', [ResidentController::class, 'getBlockOccupancyStatus']);
Route::put('/settings/spam-notifications', [UserPaymentController::class, 'updateSpamNotifications']);
Route::get('/settings/spam-notifications', [UserPaymentController::class, 'getSpamNotifications']);
Route::get('/settings/monthly-payment', [UserPaymentController::class, 'getMonthlyPaymentAmount']);
Route::post('/settings/update', [UserPaymentController::class, 'updateSettings']);
Route::get('/user/tenants/{user}', [UserPaymentController::class, 'getMyTenants']);
Route::post('/user/tenants/new', [UserPaymentController::class, 'addNewTenant']);
Route::put('/user/tenants/{user}', [UserPaymentController::class, 'updateTenant']);
Route::delete('/user/tenants/{user}', [UserPaymentController::class, 'deleteTenant']);
Route::put('/user/tenants/holder/{user}', [UserPaymentController::class, 'updateAccountHolder']);






Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/families/{block}-{lot}', [FamilyController::class, 'getFamilyDetails']);
    Route::get('/families/tenants/{block}-{lot}', [FamilyController::class, 'getFamilyTenantDetails']);
    Route::put('/families/{block}-{lot}/account-holder', [FamilyController::class, 'updateAccountHolder']);
});