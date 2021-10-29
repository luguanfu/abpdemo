using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class DBController : BaseController
    {
        CommonBll commonBll = new CommonBll();
        //
        // GET: /Admin/DB/

        public ActionResult Index()
        {
            var dtAssessment = SqlHelper.ExecuteDataTable("select * from bsi_PracticeAssessment");
            ViewData["Assessment"] = dtAssessment;
            return View();
        }

        public string GetList()
        {
            var dtList = SqlHelper.ExecuteDataTable("select * from dbConfig");

            return JsonConvert.SerializeObject(dtList);
        }

        public string GetOnly()
        {
            var id = Request["ID"] ?? "0";
            var dtOnly = SqlHelper.ExecuteDataTable("select * from dbConfig where ID=" + id);

            return JsonConvert.SerializeObject(dtOnly);
        }

        public string init()
        {
            var id = Request["ID"] ?? "0";
            commonBll.ExecuteNonQuery(GetDBIndex(id), ProcDBJB(int.Parse(id),true));
            return "1";
        }

        public string Clear()
        {
            var id = Request["ID"] ?? "0";
            commonBll.ExecuteNonQuery(GetDBIndex(id), ProcDBJB(int.Parse(id),false));
            return "1";
        }

        public string update()
        {
            var id = Request["ID"] ?? "0";
            var ip = Request["ip"] ?? "";
            var name = Request["name"] ?? "";
            var loginNo = Request["loginNo"] ?? "";
            var pwd = Request["pwd"] ?? "";
            var dtOnly = SqlHelper.ExecuteNonQuery("update dbConfig set ConntionIP='" + ip + "',DatabankName='" + name + "',LoginNo='" + loginNo + "',PassWord='" + pwd + "',UpdateTime=getdate(),Updater='" + UserNo + "' where ID=" + id);
            return dtOnly.ToString();
        }

        public string CreateSource()
        {
            var id = Request["ID"] ?? "0";
            var count = Request["teamCount"] ?? "0";
            var teamName = Request["teamName"] ?? "队伍";
            var school = Request["school"] ?? "学校-湖南-长沙";
            var college = Request["college"] ?? "学院";
            var major = Request["major"] ?? "专业";
            StringBuilder strJB = new StringBuilder();
            strJB.Append("declare @sid int;\n");
            strJB.Append("declare @cid int;\n");
            strJB.Append("declare @uid int;\n");
            strJB.Append("declare @tid int;\n");
            strJB.Append("declare @mid int;\n");
            strJB.Append("declare @count int;\n");
            strJB.Append("insert into tb_School(SchoolName, province, City, DetailedAddress, AddUserId, AddTime,Extra3) values('"+ school.Split('-')[0]+ "', '" + school.Split('-')[1] + "', '" + school.Split('-')[1] + "', null, 1, getdate(), DATEADD(year, 1, getdate()));\n");
            strJB.Append("set @sid=@@IDENTITY;\n");
            strJB.Append("insert into tb_College(SchoolId, CollegeName, AddUserId, AddTime) values(@sid, '"+ college + "', 1, GETDATE());\n");
            strJB.Append("set @cid=@@IDENTITY;\n");

            strJB.Append("insert into tb_Major(SchoolId, CollegeId, MajorName,AddUserId,AddTime) values(@sid, @cid, '"+major+ "', 1, GETDATE());\n");
            strJB.Append("set @mid=@@IDENTITY;\n");
            strJB.Append("insert into tb_User(LoginNo, Password, Type,State,AddUserId,AddTime) values('t0001', '888888', 2, 1, 1, GETDATE());\n");
            strJB.Append("set @uid=@@IDENTITY;\n");
            strJB.Append("insert into tb_Teacher(SchoolId, UserId, TeacherName,Contact,Email,AddUserId,AddTime) values(@sid, @uid, '李老师', '', '', 1, GETDATE());\n");
            strJB.Append("set @tid=@@IDENTITY;\n");
            strJB.Append("set @count=0;\n");
            strJB.Append("while(@count<"+count+ ")\n");
            strJB.Append("begin\n");
            strJB.Append("declare @mCount varchar(20);\n");
            strJB.Append("if(@count+1<=9)\n");
            strJB.Append("begin\n");
            strJB.Append("set @mCount='0'+cast(@count+1 as varchar);\n");
            strJB.Append("end\n");
            strJB.Append("else\n");
            strJB.Append("begin\n");
            strJB.Append("set @mCount=cast(@count+1 as varchar);\n");
            strJB.Append("end\n");
            strJB.Append("insert into tb_Class(SchoolId,CollegeId,MajorId,TeacherId,ClassName,AddUserId,AddTime) values(@sid, @cid, @mid, @uid, '" + teamName+ "' + @mCount, 1, GETDATE());\n");
            strJB.Append("set @count=@count+1;\n");
            strJB.Append("end\n");

            commonBll.ExecuteNonQuery(GetDBIndex(id), strJB.ToString());
            return "1";
        }


        private int GetDBIndex(string dbid)
        {
            int index = 0;
            switch(dbid)
            {
                case "1":index = 2;break;
                case "2": index = 3; break;
                case "3": index = 5; break;
                case "4": index = 6; break;
            }
            return index;
        }

        private string ProcDBJB(int index,bool isInit)
        {
            StringBuilder strJB = new StringBuilder();
            //1=信贷，2=理财，3=大堂，4=柜员
            switch(index)
            {
                case 1:
                    if(isInit)
                    {
                        strJB.Append("truncate table bi_BankTeller;");
                        strJB.Append("truncate table bi_Team;");                        
                    }
                    strJB.Append("truncate table BalanceSheet;");
                    strJB.Append("truncate table BalanceSheet1;");
                    strJB.Append("truncate table xd_Customer_RiskClassification;");
                    strJB.Append("truncate table xd_Individual_RiskClassification;");
                    strJB.Append("truncate table xd_WorkFlow_BadDebt_Affirm;");
                    strJB.Append("truncate table xd_WorkFlow_BadDebt_Approve;");
                    strJB.Append("truncate table xd_WorkFlow_BadDebt_Cancel;");
                    strJB.Append("truncate table xd_WorkFlow_BadDebt_Scrutiny;");
                    strJB.Append("truncate table xd_WorkFlow_CreditBiz_Approve;");
                    strJB.Append("truncate table xd_WorkFlow_CreditBiz_Research;");
                    strJB.Append("truncate table xd_WorkFlow_CreditBiz_Scrutiny;");
                    strJB.Append("truncate table xd_WorkFlow_Lending_Examine;");
                    strJB.Append("truncate table xd_WorkFlow_Lending_Extend;");
                    strJB.Append("truncate table xd_WorkFlow_Lending_RegistContract;");
                    strJB.Append("truncate table bi_Teller_CashDrawer;");
                    strJB.Append("truncate table zhyw_ExamCurrentTask;");
                    strJB.Append("truncate table zhyw_ExamLog;");
                    strJB.Append("truncate table Lock_Customer;");
                    strJB.Append("truncate table lock_Individual_Customer;");
                    strJB.Append("truncate table dal_ComplexTimer;");
                    strJB.Append("truncate table zhyw_ExamResult;");
                    strJB.Append("truncate table zhyw_ExamResultForm;");
                    strJB.Append("truncate table zhyw_ExamResultTask;");
                    strJB.Append("truncate table zhyw_ExamResultTaskDetail;");
                    strJB.Append("update  [dbo].[bi_SerialNo] set [Serial_Value]='0000';\n");
                    strJB.Append("declare @tablename nvarchar(100)\n");
                    strJB.Append("DECLARE test_Cursor CURSOR LOCAL FOR\n");
                    strJB.Append("select name from dbo.sysobjects where xtype='u' and (not name LIKE 'dtproperties') and name like'yw_%' order by name\n");
                    strJB.Append("open test_Cursor\n");
                    strJB.Append("FETCH NEXT FROM test_Cursor into @tablename\n");
                    strJB.Append("WHILE  (@@fetch_status=0)\n");
                    strJB.Append("begin\n");
                    strJB.Append("exec('truncate table '+ @tablename)\n");
                    strJB.Append("fetch next from test_Cursor into @tablename\n");
                    strJB.Append("end\n");
                    strJB.Append("close test_Cursor\n");
                    strJB.Append("deallocate test_Cursor\n");
                    break;
                case 2:
                    if(isInit)
                    {
                        strJB.Append("truncate table bi_BankTeller;");
                        strJB.Append("truncate table bi_Team;");
                    }
                    strJB.Append("truncate table dal_ComplexTimer;");
                    strJB.Append("truncate table bi_Teller_CashDrawer;");
                    strJB.Append("truncate table dbo.cps_ExamResult;");
                    strJB.Append("truncate table dbo.cps_ExamResult_Detail;");
                    strJB.Append("truncate table dbo.dcs_ExamResult;");
                    strJB.Append("truncate table dbo.dcs_ExamResult_Detail;");
                    strJB.Append("truncate table dbo.dzs_ExamResult;");
                    strJB.Append("truncate table dbo.dzs_ExamResult_Detail;");
                    strJB.Append("truncate table bi_Teller_CashDrawer;");
                    strJB.Append("truncate table zhyw_ExamCurrentTask;");
                    strJB.Append("truncate table zhyw_ExamLog;");
                    strJB.Append("truncate table zhyw_ExamResult;");
                    strJB.Append("truncate table zhyw_ExamResultForm;");
                    strJB.Append("truncate table zhyw_ExamResultTask;");
                    strJB.Append("truncate table zhyw_ExamResultTaskDetail;");
                    strJB.Append("truncate table dbo.YangLaoGuiHua_ShiJianXian;");
                    strJB.Append("update  [dbo].[bi_SerialNo] set [Serial_Value]='0000';\n");
                    strJB.Append("declare @tablename nvarchar(100)\n");
                    strJB.Append("DECLARE test_Cursor CURSOR LOCAL FOR\n");
                    strJB.Append("select name from dbo.sysobjects where xtype='u' and (not name LIKE 'dtproperties') and name like'yw_%' order by name\n");
                    strJB.Append("open test_Cursor\n");
                    strJB.Append("FETCH NEXT FROM test_Cursor into @tablename\n");
                    strJB.Append("WHILE  (@@fetch_status=0)\n");
                    strJB.Append("begin\n");
                    strJB.Append("exec('truncate table '+ @tablename)\n");
                    strJB.Append("fetch next from test_Cursor into @tablename\n");
                    strJB.Append("end\n");
                    strJB.Append("close test_Cursor\n");
                    strJB.Append("deallocate test_Cursor\n");
                    break;
                case 3:
                    if(isInit)
                    {
                        strJB.Append("truncate table tb_Major;");
                        strJB.Append("truncate table tb_school;");
                        strJB.Append("truncate table tb_student;");
                        strJB.Append("truncate table tb_teacher;");
                        strJB.Append("delete from tb_User where Type in (2,3);");
                        strJB.Append("truncate table tb_Class;");
                        strJB.Append("truncate table tb_College;");
                    }
                    strJB.Append("truncate table bsi_PracticeAssessment;");
                    strJB.Append("truncate table bsi_PracticeTasks;");
                    strJB.Append("truncate table bsi_PracticeClass;");                    
                    strJB.Append("truncate table zhyw_ExamLog;");
                    strJB.Append("truncate table zhyw_ExamCurrentTask;");
                    strJB.Append("truncate table tb_loginJL;");   
                    strJB.Append("truncate table bsi_resourceRecord;");
                    strJB.Append("truncate table bsi_stuAbilityScore;");
                    strJB.Append("truncate table bsi_StuTotalAbilityScore;");
                    strJB.Append("truncate table bsi_TaskCustomerRecord;");
                    strJB.Append("truncate table bsi_TotalResult;");
                    strJB.Append("truncate table bsi_TotalResultDetailed;");
                    strJB.Append("truncate table bsi_TotalResultTask;");                    
                    strJB.Append("truncate table tb_CountDown;");
                    strJB.Append("truncate table tb_ExaminationDetails;");
                    strJB.Append("truncate table tb_ExaminationResult;");
                    strJB.Append("truncate table bsi_010001;");
                    strJB.Append("truncate table bsi_010101;");
                    strJB.Append("truncate table bsi_010102;");
                    strJB.Append("truncate table bsi_010103;");
                    strJB.Append("truncate table bsi_010104;");
                    strJB.Append("truncate table bsi_010105;");
                    strJB.Append("truncate table bsi_010106;");
                    strJB.Append("truncate table bsi_010107;");
                    strJB.Append("truncate table bsi_010108;");
                    strJB.Append("truncate table bsi_010109;");
                    strJB.Append("truncate table bsi_010110;");
                    strJB.Append("truncate table bsi_010114;");
                    strJB.Append("truncate table bsi_010302;");
                    strJB.Append("truncate table bsi_010303;");
                    strJB.Append("truncate table bsi_010401;");
                    strJB.Append("truncate table bsi_010402;");
                    strJB.Append("truncate table bsi_010501;");
                    strJB.Append("truncate table bsi_010601;");
                    strJB.Append("truncate table bsi_010702;");
                    strJB.Append("truncate table bsi_010901;");
                    strJB.Append("truncate table bsi_010902;");
                    strJB.Append("truncate table bsi_010903;");
                    strJB.Append("truncate table bsi_010904;");
                    strJB.Append("truncate table bsi_010905;");
                    strJB.Append("truncate table bsi_010906;");
                    strJB.Append("truncate table bsi_010907;");
                    strJB.Append("truncate table bsi_010910;");
                    strJB.Append("truncate table bsi_020501;");
                    strJB.Append("truncate table bsi_020502;");
                    strJB.Append("truncate table bsi_020704;");
                    strJB.Append("truncate table bsi_030101;");
                    strJB.Append("truncate table bsi_030104;");
                    strJB.Append("truncate table bsi_030107;");
                    strJB.Append("truncate table bsi_030601;");
                    strJB.Append("truncate table bsi_030602;");
                    strJB.Append("truncate table bsi_030603;");
                    strJB.Append("truncate table bsi_030604;");
                    strJB.Append("truncate table bsi_030605;");
                    strJB.Append("truncate table bsi_030606;");
                    strJB.Append("truncate table bsi_030607;");
                    strJB.Append("truncate table bsi_030608;");
                    strJB.Append("truncate table bsi_030609;");
                    strJB.Append("truncate table bsi_030610;");
                    strJB.Append("truncate table bsi_030611;");
                    strJB.Append("truncate table bsi_030612;");
                    strJB.Append("truncate table bsi_050503;");
                    strJB.Append("truncate table bsi_050504;");
                    strJB.Append("truncate table bsi_050510;");
                    strJB.Append("truncate table bsi_050511;");
                    strJB.Append("truncate table bsi_060201;");
                    strJB.Append("truncate table bsi_060202;");
                    strJB.Append("truncate table bsi_060302;");
                    strJB.Append("truncate table bsi_060501;");
                    strJB.Append("truncate table bsi_060505;");
                    strJB.Append("truncate table bsi_060701;");
                    strJB.Append("truncate table bsi_060702;");
                    strJB.Append("truncate table bsi_060703;");
                    strJB.Append("truncate table bsi_060704;");
                    strJB.Append("truncate table bsi_060707;");
                    strJB.Append("truncate table bsi_062001;");
                    strJB.Append("truncate table bsi_062002;");
                    strJB.Append("truncate table bsi_062003;");
                    strJB.Append("truncate table bsi_062004;");
                    strJB.Append("truncate table bsi_062005;");
                    strJB.Append("truncate table bsi_062301;");
                    strJB.Append("truncate table bsi_062801;");
                    strJB.Append("truncate table bsi_062804;");
                    strJB.Append("truncate table bsi_063101;");
                    strJB.Append("truncate table bsi_063201;");
                    strJB.Append("truncate table bsi_063202;");
                    strJB.Append("truncate table bsi_063301;");
                    strJB.Append("truncate table bsi_063901;");
                    strJB.Append("truncate table bsi_063902;");
                    strJB.Append("truncate table bsi_065401;");
                    strJB.Append("truncate table bsi_065501;");
                    strJB.Append("truncate table bsi_080101;");
                    strJB.Append("truncate table bsi_080102;");
                    strJB.Append("truncate table bsi_080201;");
                    strJB.Append("truncate table bsi_080204;");
                    strJB.Append("truncate table bsi_080205;");
                    strJB.Append("truncate table bsi_080701;");
                    strJB.Append("truncate table bsi_080702;");
                    strJB.Append("truncate table bsi_080703;");
                    strJB.Append("truncate table bsi_080704;");
                    strJB.Append("truncate table bsi_080705;");
                    strJB.Append("truncate table bsi_080706;");
                    strJB.Append("truncate table bsi_080707;");
                    strJB.Append("truncate table bsi_080708;");
                    strJB.Append("truncate table bsi_080803;");
                    strJB.Append("truncate table bsi_081001;");
                    strJB.Append("truncate table bsi_081003;");
                    strJB.Append("truncate table bsi_081004;");
                    strJB.Append("truncate table bsi_081005;");
                    strJB.Append("truncate table bsi_081010;");
                    strJB.Append("truncate table bsi_081201;");
                    strJB.Append("truncate table bsi_090201;");
                    strJB.Append("truncate table bsi_090202;");
                    strJB.Append("truncate table bsi_090203;");
                    strJB.Append("truncate table bsi_090204;");
                    strJB.Append("truncate table bsi_090206;");
                    strJB.Append("truncate table bsi_090207;");
                    strJB.Append("truncate table bsi_091001;");
                    strJB.Append("truncate table bsi_091003;");
                    strJB.Append("truncate table bsi_091004;");
                    strJB.Append("truncate table bsi_091005;");
                    strJB.Append("truncate table bsi_091006;");
                    strJB.Append("truncate table bsi_091007;");
                    strJB.Append("truncate table bsi_091008;");
                    strJB.Append("truncate table bsi_091009;");
                    strJB.Append("truncate table bsi_091010;");
                    strJB.Append("truncate table bsi_091012;");
                    strJB.Append("truncate table bsi_091101;");
                    strJB.Append("truncate table bsi_091104;");
                    strJB.Append("truncate table bsi_091105;");
                    strJB.Append("truncate table bsi_091106;");
                    strJB.Append("truncate table bsi_091107;");
                    strJB.Append("truncate table bsi_100101;");
                    strJB.Append("truncate table bsi_100102;");
                    strJB.Append("truncate table bsi_100103;");
                    strJB.Append("truncate table bsi_100104;");
                    strJB.Append("truncate table bsi_110101;");
                    strJB.Append("truncate table bsi_110201;");
                    strJB.Append("truncate table bsi_110202;");
                    strJB.Append("truncate table bsi_110203;");
                    strJB.Append("truncate table bsi_110204;");
                    strJB.Append("truncate table bsi_110205;");
                    strJB.Append("truncate table bsi_110206;");
                    strJB.Append("truncate table bsi_110208;");
                    strJB.Append("truncate table bsi_110209;");
                    strJB.Append("truncate table bsi_110210;");
                    strJB.Append("truncate table bsi_110211;");
                    strJB.Append("truncate table bsi_110212;");
                    strJB.Append("truncate table bsi_110301;");
                    strJB.Append("truncate table bsi_110302;");
                    strJB.Append("truncate table bsi_110303;");
                    strJB.Append("truncate table bsi_110304;");
                    strJB.Append("truncate table bsi_110305;");
                    strJB.Append("truncate table bsi_110306;");
                    strJB.Append("truncate table bsi_110308;");
                    strJB.Append("truncate table bsi_110309;");
                    strJB.Append("truncate table bsi_110310;");
                    strJB.Append("truncate table bsi_110311;");
                    strJB.Append("truncate table bsi_110312;");
                    strJB.Append("truncate table bsi_120101;");
                    strJB.Append("truncate table bsi_120102;");
                    strJB.Append("truncate table bsi_120103;");
                    strJB.Append("truncate table bsi_120104;");
                    strJB.Append("truncate table bsi_120201;");
                    strJB.Append("truncate table bsi_120202;");
                    strJB.Append("truncate table bsi_120203;");
                    strJB.Append("truncate table bsi_120204;");
                    strJB.Append("truncate table bsi_120205;");
                    strJB.Append("truncate table bsi_120206;");
                    strJB.Append("truncate table bsi_120207;");
                    strJB.Append("truncate table bsi_120208;");
                    strJB.Append("truncate table bsi_120209;");
                    strJB.Append("truncate table bsi_120210;");
                    strJB.Append("truncate table bsi_120211;");
                    strJB.Append("truncate table bsi_120212;");
                    strJB.Append("truncate table bsi_120213;");
                    strJB.Append("truncate table bsi_120214;");
                    strJB.Append("truncate table bsi_120215;");
                    strJB.Append("truncate table bsi_120216;");
                    strJB.Append("truncate table bsi_120217;");
                    strJB.Append("truncate table bsi_120218;");
                    strJB.Append("truncate table bsi_120219;");
                    strJB.Append("truncate table bsi_120220;");
                    strJB.Append("truncate table bsi_120221;");
                    strJB.Append("truncate table bsi_120222;");
                    strJB.Append("truncate table bsi_120223;");
                    strJB.Append("truncate table bsi_120224;");
                    strJB.Append("truncate table bsi_120225;");
                    strJB.Append("truncate table bsi_120226;");
                    strJB.Append("truncate table bsi_120234;");
                    strJB.Append("truncate table bsi_120235;");
                    strJB.Append("truncate table bsi_130101;");
                    strJB.Append("truncate table bsi_130102;");
                    strJB.Append("truncate table bsi_130103;");
                    strJB.Append("truncate table bsi_130104;");
                    strJB.Append("truncate table bsi_130105;");
                    strJB.Append("truncate table bsi_130106;");
                    strJB.Append("truncate table bsi_130107;");
                    strJB.Append("truncate table bsi_140101;");
                    strJB.Append("truncate table bsi_140102;");
                    strJB.Append("truncate table bsi_140103;");
                    strJB.Append("truncate table bsi_140104;");
                    strJB.Append("truncate table bsi_140105;");
                    strJB.Append("truncate table bsi_140106;");
                    strJB.Append("truncate table bsi_140107;");
                    strJB.Append("truncate table bsi_140108;");
                    strJB.Append("truncate table bsi_140109;");
                    strJB.Append("truncate table bsi_140201;");
                    strJB.Append("truncate table bsi_140202;");
                    strJB.Append("truncate table bsi_140203;");
                    strJB.Append("truncate table bsi_140301;");
                    break;
                case 4:
                    if(isInit)
                    {
                        strJB.Append("truncate table tb_loginJL;");
                        strJB.Append("truncate table tb_Major;");
                        strJB.Append("truncate table tb_school;");
                        strJB.Append("truncate table tb_student;");
                        strJB.Append("truncate table tb_teacher;");
                        strJB.Append("truncate table tb_Class;");
                        strJB.Append("truncate table tb_College;");
                        strJB.Append("delete from tb_User where Type in (2,3);");
                    }
                    strJB.Append("truncate table bsi_PracticeAssessment;");
                    strJB.Append("truncate table bsi_PracticeTasks;");
                    strJB.Append("truncate table bsi_PracticeClass;");
                    strJB.Append("truncate table zhyw_ExamLog;");
                    strJB.Append("truncate table zhyw_ExamCurrentTask;");                    
                    strJB.Append("truncate table bsi_resourceRecord;");
                    strJB.Append("truncate table bsi_stuAbilityScore;");
                    strJB.Append("truncate table bsi_StuTotalAbilityScore;");
                    strJB.Append("truncate table bsi_TotalResult;");
                    strJB.Append("truncate table bsi_TotalResultDetailed;");
                    strJB.Append("truncate table bsi_TotalResultTask;");                    
                    strJB.Append("truncate table tb_CountDown;");
                    strJB.Append("truncate table tb_ExaminationDetails;");
                    strJB.Append("truncate table tb_ExaminationResult;");
                    strJB.Append("truncate table tb_TaskResultDesc;");
                    strJB.Append("truncate table bsi_TaskCustomerRecord;");
                    strJB.Append("truncate table bsi_010001;");
                    strJB.Append("truncate table bsi_010101;");
                    strJB.Append("truncate table bsi_010102;");
                    strJB.Append("truncate table bsi_010103;");
                    strJB.Append("truncate table bsi_010104;");
                    strJB.Append("truncate table bsi_010105;");
                    strJB.Append("truncate table bsi_010106;");
                    strJB.Append("truncate table bsi_010107;");
                    strJB.Append("truncate table bsi_010108;");
                    strJB.Append("truncate table bsi_010109;");
                    strJB.Append("truncate table bsi_010110;");
                    strJB.Append("truncate table bsi_010114;");
                    strJB.Append("truncate table bsi_010302;");
                    strJB.Append("truncate table bsi_010303;");
                    strJB.Append("truncate table bsi_010401;");
                    strJB.Append("truncate table bsi_010402;");
                    strJB.Append("truncate table bsi_010501;");                    
                    strJB.Append("truncate table bsi_010601;");
                    strJB.Append("truncate table bsi_010702;");
                    strJB.Append("truncate table bsi_010901;");
                    strJB.Append("truncate table bsi_010902;");
                    strJB.Append("truncate table bsi_010903;");
                    strJB.Append("truncate table bsi_010904;");
                    strJB.Append("truncate table bsi_010905;");
                    strJB.Append("truncate table bsi_010906;");
                    strJB.Append("truncate table bsi_010907;");
                    strJB.Append("truncate table bsi_010910;");
                    strJB.Append("truncate table bsi_020501;");
                    strJB.Append("truncate table bsi_020502;");
                    strJB.Append("truncate table bsi_020704;");
                    strJB.Append("truncate table bsi_030101;");
                    strJB.Append("truncate table bsi_030104;");
                    strJB.Append("truncate table bsi_030107;");
                    strJB.Append("truncate table bsi_030601;");
                    strJB.Append("truncate table bsi_030602;");
                    strJB.Append("truncate table bsi_030603;");
                    strJB.Append("truncate table bsi_030604;");                    
                    strJB.Append("truncate table bsi_030605;");
                    strJB.Append("truncate table bsi_030606;");
                    strJB.Append("truncate table bsi_030607;");
                    strJB.Append("truncate table bsi_030608;");
                    strJB.Append("truncate table bsi_030609;");
                    strJB.Append("truncate table bsi_030610;");
                    strJB.Append("truncate table bsi_030611;");
                    strJB.Append("truncate table bsi_030612;");
                    strJB.Append("truncate table bsi_050503;");
                    strJB.Append("truncate table bsi_050504;");
                    strJB.Append("truncate table bsi_050510;");
                    strJB.Append("truncate table bsi_050511;");
                    strJB.Append("truncate table bsi_060201;");
                    strJB.Append("truncate table bsi_060202;");
                    strJB.Append("truncate table bsi_060302;");
                    strJB.Append("truncate table bsi_060501;");
                    strJB.Append("truncate table bsi_060505;");
                    strJB.Append("truncate table bsi_060701;");
                    strJB.Append("truncate table bsi_060702;");
                    strJB.Append("truncate table bsi_060703;");
                    strJB.Append("truncate table bsi_060704;");
                    strJB.Append("truncate table bsi_060707;");                    
                    strJB.Append("truncate table bsi_062001;");
                    strJB.Append("truncate table bsi_062002;");
                    strJB.Append("truncate table bsi_062003;");
                    strJB.Append("truncate table bsi_062004;");
                    strJB.Append("truncate table bsi_062005;");
                    strJB.Append("truncate table bsi_062301;");
                    strJB.Append("truncate table bsi_062801;");
                    strJB.Append("truncate table bsi_062804;");
                    strJB.Append("truncate table bsi_063101;");
                    strJB.Append("truncate table bsi_063201;");
                    strJB.Append("truncate table bsi_063202;");
                    strJB.Append("truncate table bsi_063301;");
                    strJB.Append("truncate table bsi_063901;");
                    strJB.Append("truncate table bsi_063902;");
                    strJB.Append("truncate table bsi_065401;");
                    strJB.Append("truncate table bsi_065501;");
                    strJB.Append("truncate table bsi_080101;");
                    strJB.Append("truncate table bsi_080102;");
                    strJB.Append("truncate table bsi_080201;");
                    strJB.Append("truncate table bsi_080204;");
                    strJB.Append("truncate table bsi_080205;");
                    strJB.Append("truncate table bsi_080701;");
                    strJB.Append("truncate table bsi_080702;");
                    strJB.Append("truncate table bsi_080703;");
                    strJB.Append("truncate table bsi_080704;");
                    strJB.Append("truncate table bsi_080705;");
                    strJB.Append("truncate table bsi_080706;");                   
                    strJB.Append("truncate table bsi_080707;");
                    strJB.Append("truncate table bsi_080708;");
                    strJB.Append("truncate table bsi_080803;");
                    strJB.Append("truncate table bsi_081001;");
                    strJB.Append("truncate table bsi_081003;");
                    strJB.Append("truncate table bsi_081004;");
                    strJB.Append("truncate table bsi_081005;");
                    strJB.Append("truncate table bsi_081010;");
                    strJB.Append("truncate table bsi_081201;");
                    strJB.Append("truncate table bsi_090201;");
                    strJB.Append("truncate table bsi_090202;");
                    strJB.Append("truncate table bsi_090203;");
                    strJB.Append("truncate table bsi_090204;");
                    strJB.Append("truncate table bsi_090206;");
                    strJB.Append("truncate table bsi_090207;");
                    strJB.Append("truncate table bsi_091001;");
                    strJB.Append("truncate table bsi_091003;");
                    strJB.Append("truncate table bsi_091004;");
                    strJB.Append("truncate table bsi_091005;");
                    strJB.Append("truncate table bsi_091006;");
                    strJB.Append("truncate table bsi_091007;");
                    strJB.Append("truncate table bsi_091008;");
                    strJB.Append("truncate table bsi_091009;");
                    strJB.Append("truncate table bsi_091010;");
                    strJB.Append("truncate table bsi_091012;");
                    strJB.Append("truncate table bsi_091101;");
                    strJB.Append("truncate table bsi_091104;");
                    strJB.Append("truncate table bsi_091105;");
                    strJB.Append("truncate table bsi_091106;");
                    strJB.Append("truncate table bsi_091107;");
                    strJB.Append("truncate table bsi_100101;");
                    strJB.Append("truncate table bsi_100102;");                    
                    strJB.Append("truncate table bsi_100103;");
                    strJB.Append("truncate table bsi_100104;");
                    strJB.Append("truncate table bsi_110101;");
                    strJB.Append("truncate table bsi_110201;");
                    strJB.Append("truncate table bsi_110202;");
                    strJB.Append("truncate table bsi_110203;");
                    strJB.Append("truncate table bsi_110204;");
                    strJB.Append("truncate table bsi_110205;");
                    strJB.Append("truncate table bsi_110206;");
                    strJB.Append("truncate table bsi_110208;");
                    strJB.Append("truncate table bsi_110209;");
                    strJB.Append("truncate table bsi_110210;");
                    strJB.Append("truncate table bsi_110211;");
                    strJB.Append("truncate table bsi_110212;");
                    strJB.Append("truncate table bsi_110301;");
                    strJB.Append("truncate table bsi_110302;");
                    strJB.Append("truncate table bsi_110303;");
                    strJB.Append("truncate table bsi_110304;");
                    strJB.Append("truncate table bsi_110305;");
                    strJB.Append("truncate table bsi_110306;");
                    strJB.Append("truncate table bsi_110308;");
                    strJB.Append("truncate table bsi_110309;");
                    strJB.Append("truncate table bsi_110310;");
                    strJB.Append("truncate table bsi_110311;");
                    strJB.Append("truncate table bsi_110312;");
                    strJB.Append("truncate table bsi_120101;");
                    strJB.Append("truncate table bsi_120102;");
                    strJB.Append("truncate table bsi_120103;");
                    strJB.Append("truncate table bsi_120104;");                    
                    strJB.Append("truncate table bsi_120201;");
                    strJB.Append("truncate table bsi_120202;");
                    strJB.Append("truncate table bsi_120203;");
                    strJB.Append("truncate table bsi_120204;");
                    strJB.Append("truncate table bsi_120205;");
                    strJB.Append("truncate table bsi_120206;");
                    strJB.Append("truncate table bsi_120207;");
                    strJB.Append("truncate table bsi_120208;");
                    strJB.Append("truncate table bsi_120209;");
                    strJB.Append("truncate table bsi_120210;");
                    strJB.Append("truncate table bsi_120211;");
                    strJB.Append("truncate table bsi_120212;");
                    strJB.Append("truncate table bsi_120213;");
                    strJB.Append("truncate table bsi_120214;");
                    strJB.Append("truncate table bsi_120215;");
                    strJB.Append("truncate table bsi_120216;");
                    strJB.Append("truncate table bsi_120217;");
                    strJB.Append("truncate table bsi_120218;");
                    strJB.Append("truncate table bsi_120219;");
                    strJB.Append("truncate table bsi_120220;");                    
                    strJB.Append("truncate table bsi_120221;");
                    strJB.Append("truncate table bsi_120222;");
                    strJB.Append("truncate table bsi_120223;");
                    strJB.Append("truncate table bsi_120224;");
                    strJB.Append("truncate table bsi_120225;");
                    strJB.Append("truncate table bsi_120226;");
                    strJB.Append("truncate table bsi_120234;");
                    strJB.Append("truncate table bsi_120235;");
                    strJB.Append("truncate table bsi_130101;");
                    strJB.Append("truncate table bsi_130102;");
                    strJB.Append("truncate table bsi_130103;");
                    strJB.Append("truncate table bsi_130104;");
                    strJB.Append("truncate table bsi_130105;");
                    strJB.Append("truncate table bsi_130106;");
                    strJB.Append("truncate table bsi_130107;");
                    strJB.Append("truncate table bsi_140101;");
                    strJB.Append("truncate table bsi_140102;");
                    strJB.Append("truncate table bsi_140103;");
                    strJB.Append("truncate table bsi_140104;");                    
                    strJB.Append("truncate table bsi_140105;");
                    strJB.Append("truncate table bsi_140106;");
                    strJB.Append("truncate table bsi_140107;");
                    strJB.Append("truncate table bsi_140108;");
                    strJB.Append("truncate table bsi_140109;");
                    strJB.Append("truncate table bsi_140201;");
                    strJB.Append("truncate table bsi_140202;");
                    strJB.Append("truncate table bsi_140203;");
                    strJB.Append("truncate table bsi_140301;");
                    break;
            }
            return strJB.ToString();
        }



    }
}
