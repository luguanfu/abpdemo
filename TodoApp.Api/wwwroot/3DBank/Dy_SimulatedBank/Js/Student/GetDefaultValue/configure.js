
/***************************************
                  说明（开发人员略过）
  格式： nodejs_is_release?"生产环境域名":"测试环境域名"
  nodejs_is_release为false则使用测试环境域名
  nodejs_is_release为true 则使用生产环境域名
   
****************************************/

/*
 * nodejs是否发布到外网
 * 测试环境：false, 生产环境：true
 * @包含于nodejs项目
 */
var nodejs_is_release = false;


/*
 * 后台成绩导出域名配置
 * @包含于公共表格项目
 */
var manager_mark_import_domain = nodejs_is_release ? "http://120.24.172.198:5843/" : "http://localhost:19748/";

/*
 * 后台默认值域名配置
 * @包含于前台项目
 */
//var default_val_set_domain = nodejs_is_release ? "http://120.24.172.198:5841/" : "http://192.168.1.61:4001/";
var default_val_set_domain = nodejs_is_release ? "http://120.24.172.198:5841/" : "http://localhost:12472/";

/*
 * 后台批量导入用户功能域名配置
 * @包含于公共表格项目
 */
var manager_user_export_domain = nodejs_is_release ? "http://120.24.172.198:5843/" : "http://localhost:19748/";


/*
 * 后台字符录入导入功能域名配置
 * @包含于公共表格项目
 */
var manager_char_export_domain = nodejs_is_release ? "http://120.24.172.198:5843/" : "http://localhost:19748/";

  
/*
 * nodejs业务表单中嵌入表格域名配置
 * @包含于公共表格项目
 */
var busi_common_table_domain = nodejs_is_release ? "http://120.24.172.198:5843/" : "http://localhost:19748/";

/*
 * nodejs业务表单发布静态页面域名配置
 * @包含于静态页面发布项目
 */
var busi_static_page_domain = nodejs_is_release ? "http://120.24.172.198:5844/" : "http://192.168.1.61:5559/";




