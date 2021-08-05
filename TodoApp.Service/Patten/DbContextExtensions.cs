using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Service.Patten
{
    public static class DbContextExtensions
    {
        private static void CombineParams(ref DbCommand command, params SqlParameter[] parameters)
        {
            if (parameters != null)
            {
                foreach (SqlParameter parameter in parameters)
                {
                    if (!parameter.ParameterName.Contains("@"))
                        parameter.ParameterName = $"@{parameter.ParameterName}";
                    command.Parameters.Add(parameter);
                }
            }
        }
        private static DbCommand CreateCommand(DatabaseFacade facade, string sql, out DbConnection dbConn, params SqlParameter[] parameters)
        {
            DbConnection conn = facade.GetDbConnection();
            dbConn = conn;
            conn.Open();
            DbCommand cmd = conn.CreateCommand();
            if (facade.IsSqlServer())
            {
                cmd.CommandText = sql;
                CombineParams(ref cmd, parameters);
            }
            return cmd;
        }
        public static DataTable SqlQuery(this DatabaseFacade facade, string sql, params SqlParameter[] parameters)
        {
            DbCommand cmd = CreateCommand(facade, sql, out DbConnection conn, parameters);
            DbDataReader reader = cmd.ExecuteReader();

            DataTable dt = new DataTable();
            dt.Load(reader);
            reader.Close();
            conn.Close();
            return dt;
        }
        public static IEnumerable<T> SqlQuery<T>(this DatabaseFacade facade, string sql, params SqlParameter[] parameters) where T : class, new()
        {
            DataTable dt = SqlQuery(facade, sql, parameters);
            return dt.ToEnumerable<T>();
        }
        public static Tuple<IEnumerable<T>,int> SqlProcedure<T>(this DatabaseFacade facade, string sql, params SqlParameter[] parameters) where T : class, new()
        {
            DataTable dt = SqlProcedure(facade, sql,out int totalCount, parameters);
            return Tuple.Create(dt.ToEnumerable<T>(), totalCount);
        }
        public static DataTable SqlProcedure(this DatabaseFacade facade, string sql,out int totalCount, params SqlParameter[] parameters)
        {
            DbCommand cmd = CreateCommand(facade, sql, out DbConnection conn, parameters);
            DbDataReader reader = cmd.ExecuteReader();

            DataTable dt = new DataTable();
            dt.Load(reader);

            totalCount = 0;
            if (reader.Read())
            {
                totalCount = Convert.ToInt32(reader["TotalItems"]);
            }
            

            reader.Close();
            conn.Close();
            return dt;
        }

        public static IEnumerable<T> ToEnumerable<T>(this DataTable dt) where T : class, new()
        {
            PropertyInfo[] propertyInfos = typeof(T).GetProperties();
            T[] ts = new T[dt.Rows.Count];
            int i = 0;
            foreach (DataRow row in dt.Rows)
            {
                T t = new T();
                foreach (PropertyInfo p in propertyInfos)
                {
                    if (dt.Columns.IndexOf(p.Name) != -1 && row[p.Name] != DBNull.Value)
                        p.SetValue(t, row[p.Name], null);
                }
                ts[i] = t;
                i++;
            }
            return ts;
        }
    }
}
