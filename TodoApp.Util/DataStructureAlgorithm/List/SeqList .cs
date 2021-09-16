using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Util.DataStructureAlgorithm.List
{
    public class SeqList<T> : IListDS<T>
    {
        private int maxSize;//数组长度
        private T[] data;//数据集合
        private int last;//最大有效索引

        /// <summary>
        /// 获取指定索引值
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public T this[int index]
        {
            get
            {
                return data[index];
            }
            set
            {
                data[index] = value;
            }
        }
        /// <summary>
        /// 获取最大非空索引
        /// </summary>
        public int Last
        {
            get
            {
                return last;
            }
        }
        /// <summary>
        /// 数组长度
        /// </summary>
        public int MaxSize
        {
            get
            {
                return maxSize;
            }
            set
            {
                maxSize = value;
            }
        }
        /// <summary>
        /// 构造初始化
        /// </summary>
        /// <param name="size"></param>
        public SeqList(int size)
        {
            data = new T[size];
            maxSize = size;
            last = -1;
        }
        /// <summary>
        /// 获取有效数组
        /// </summary>
        public T[] Items
        {
            get
            {
                T[] result = new T[last + 1];
                for (int i = 0; i <= last; i++)
                {
                    result[i] = data[i];
                }
                return result;
            }
        }
        /// <summary>
        /// 获取当前数组
        /// </summary>
        public T[] AllItems
        {
            get
            {
                return data;
            }
        }
        /// <summary>
        /// 数组是否已满
        /// </summary>
        /// <returns></returns>
        public bool IsFull()
        {
            if (last == maxSize - 1)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// 追加数据
        /// </summary>
        /// <param name="item"></param>
        public void Append(T item)
        {
            if (IsFull())
            {
                throw new Exception("data is full");
            }
            data[++last] = item;
        }
        /// <summary>
        /// 清空数据
        /// </summary>
        public void Clear()
        {
            data = new T[maxSize];
            last = -1;
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public T Delete(int i)
        {
            T t = default(T);
            if (IsEmpty())
            {
                throw new Exception("data is empty");
            }
            if (i < 0 || i > last)
            {
                throw new Exception("index is error");
            }
            //位移
            t = data[i];
            for (int k = i; k < last; k++)
            {
                data[k] = data[k + 1];
            }
            --last;
            return t;
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="item"></param>
        public void Delete(T item)
        {
            Start:
            for (int k = 0; k <= last; k++)
            {
                if (data[k].Equals(item))
                {
                    Delete(k);
                    goto Start;
                }
            }
        }
        /// <summary>
        /// 获取指定索引值
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public T GetItem(int i)
        {
            if (IsEmpty())
            {
                throw new Exception("data is empty");
            }
            if (i < 0 || i > last)
            {
                throw new Exception("index is error");
            }
            return data[i];
        }
        /// <summary>
        /// 获取有效长度
        /// </summary>
        /// <returns></returns>
        public int GetLength()
        {
            return last + 1;
        }
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="item"></param>
        /// <param name="i"></param>
        public void Insert(T item, int i)
        {
            if (IsFull())
            {
                throw new Exception("data is full");
            }
            if (i > last + 1 || i < 0)
            {
                throw new Exception("index is error");
            }
            if (i == last + 1)
            {
                data[last + 1] = item;
            }
            else
            {
                //位移
                for (int k = last + 1; k >= i; k--)
                {
                    data[k + 1] = data[k];
                }
                data[i] = item;
            }
            ++last;
        }
        /// <summary>
        /// 是否为空
        /// </summary>
        /// <returns></returns>
        public bool IsEmpty()
        {
            if (last == -1)
            {
                return true;
            }

            return false;
        }
        /// <summary>
        /// 获取索引
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public int Locate(T item)
        {
            for (int k = 0; k <= last; k++)
            {
                if (data[k].Equals(item))
                {
                    return k;
                }
            }
            return -1;
        }
        /// <summary>
        /// 合并
        /// </summary>
        /// <param name="La"></param>
        /// <param name="Lb"></param>
        /// <returns></returns>
        public SeqList<T> Merge(SeqList<T> La, SeqList<T> Lb)
        {
            return null;
        }
        /// <summary>
        /// 合并&排序-升序
        /// </summary>
        /// <param name="La"></param>
        /// <param name="Lb"></param>
        /// <returns></returns>
        public SeqList<T> MergeOrder(SeqList<T> La, SeqList<T> Lb)
        {
            return null;
        }
    }
}
