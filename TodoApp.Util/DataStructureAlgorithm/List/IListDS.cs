using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Util.DataStructureAlgorithm.List
{
    public interface IListDS<T>
    {
        int GetLength();    //求长度
        void Clear();       //清空操作
        bool IsEmpty();     //判断线性表是否为空
        void Append(T item);//附加操作
        void Insert(T item,int i);//插入操作
        T Delete(int i);    //删除操作-按索引
        void Delete(T item);//删除操作-按元素
        T GetItem(int i);   //取元素
        int Locate(T item); //按值查找
    }
}
