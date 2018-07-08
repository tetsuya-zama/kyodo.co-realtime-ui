/**
 * ユーザー関連イベント
 */
const USER = {
  LOGIN: 'user.login', // ログイン
  LOGOUT: 'user.logout', // ログアウト
  TRY_LOGIN: 'user.try-login', // ログイン要求
  TRY_LOGOUT: 'user.try-logout', // ログアウト要求
  LOGIN_FAILURE: 'user.login-failure', // ログイン失敗
  TRY_SIGNUP: 'user.try-signup', // サインアップ要求
  SIGNUP_SUCCESS: 'user.signup-success', // サインアップ成功
  SIGNUP_FAILURE: 'user.signup-failure' // サインアップ失敗
}

export default USER
