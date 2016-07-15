/**
 * Created by Soon on 9/24/2015.
 */
export default class Messages {
  static usernameMinInvalid = '用户名长度不足6位';
  static usernameMaxInvalid = '用户名长度超过32位';
  static usernameRequired = '用户名不能为空';
  static usernameDuplicated = '该用户名已被注册';
  static userNotExists = '该用户名不存在';

  static passwordMinInvalid = '密码长度不足6位';
  static passwordMaxInvalid = '密码长度超过32位';
  static passwordRequired = '密码不能为空';
  static passwordRegexInvalid = '不能包含空格';
  static passwordNotMatch = '密码错误';
  static confirmPasswordNotMatch = '密码不一致';

  static newPasswordMinInvalid = '密码长度不足6位';
  static newPasswordMaxInvalid = '密码长度超过32位';
  static newPasswordRequired = '密码不能为空';
  static newPasswordRegexInvalid = '不能包含空格';

  static confirmPasswordMinInvalid = '密码长度不足6位';
  static confirmPasswordMaxInvalid = '密码长度超过32位';
  static confirmPasswordRequired = '密码不能为空';
  static confirmPasswordRegexInvalid = '不能包含空格';


  static mobileRequired = '手机号码不能为空';
  static mobileRegexInvalid = '请输入正确手机号码';
  static mobileDuplicated = '该手机号已被注册';
  static mobileNotExists = '该手机号未注册';

  static phoneRequired = '手机号码不能为空';
  static phoneRegexInvalid = '请输入正确手机号码';

  static verificationCodeRequired = '验证码不能为空';
  static verificationCodeInvalid = '验证码格式有误';
  static verificationCodeRegexInvalid = '验证码格式有误';
  static verificationCodeNotMatch = '验证码错误';
  static verificationCodeMinInvalid = '验证码长度不足6位';
  static verificationCodeMaxInvalid = '验证码长度超过32位';

  static storeNameRequired = '门店名称不能为空';
  static customerNameRequired = '姓名不能为空';
  static customerNameMaxInvalid = '长度超过32位';
  static contactRequired = '联系人不能为空';
  static regionRequired = '所在地不能为空';
  static addressRequired = '详细地址不能为空';
}
