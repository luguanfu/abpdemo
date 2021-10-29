var options = {
    // 菜单
    menus:[
        {"id":1,"pid":0,"name":"缴费支付","isOperateAuth":"0"},
        {"id":2,"pid":0,"name":"账户管理","isOperateAuth":"0"},
        {"id":3,"pid":0,"name":"转账汇款","isOperateAuth":"0"},
        {"id":4,"pid":0,"name":"存款理财","isOperateAuth":"0"},
        {"id":5,"pid":0,"name":"贷款业务","isOperateAuth":"0"},
        {"id":6,"pid":0,"name":"银企服务","isOperateAuth":"0"},
        {"id":7,"pid":0,"name":"保险产品","isOperateAuth":"0"},
        {"id":8,"pid":0,"name":"集团服务","isOperateAuth":"0"},
        {"id":9,"pid":0,"name":"企业管理台","isOperateAuth":"0"},
        {"id":10,"pid":0,"name":"设置","isOperateAuth":"0"},
        {"id":11,"pid":0,"name":"帮助","isOperateAuth":"0"},
        {"id":12,"pid":0,"name":"电子票据","isOperateAuth":"0"},
        {"id":13,"pid":0,"name":"网关认证","isOperateAuth":"0"},
        {"id":13,"pid":0,"name":"交易中心","isOperateAuth":"0"}
    ],
    // 证件种类,
    certificateKind: [
        { label: '请选择', value: '' },
        { label: 'A - 居民身份证', value: 'A' },
        { label: 'M - 户口簿', value: 'M' },
        { label: '3 - 临时居民身份证', value: '3' },
        { label: 'G - 港澳居民来往内地通行证', value: 'G' },
        { label: 'H - 台湾居民来往大陆通行证', value: 'H' },
        { label: 'I - (外国)护照', value: 'I' },
        { label: 'J - (中国)护照', value: 'J' },
        { label: '4 - 外国人永久居留身份证', value: '4' },
        { label: 'B - 军官证', value: 'B' },
        { label: 'C - 解放军文职干部证', value: 'C' },
        { label: 'D - 警官证', value: 'D' },
        { label: 'E - 解放军士兵证', value: 'E' },
        { label: 'K - 武警文职干部证', value: 'K' },
        { label: 'L - 武警士兵证', value: 'L' },
        { label: 'O - 居住证', value: 'O' },
        { label: 'S - 学生证', value: 'S' },
        { label: 'N - 对私其他证件', value: 'N' },
        { label: '0 - 港澳居民居住证', value: '0' },
        { label: '9 - 台湾居民居住证', value: '9' },
    ],
    // 法人/单位负责人类别
    categoryType: [
        { label: '请选择', value: '' },
        { label: '1 - 单位法定代表人', value: '1' },
        { label: '2 - 单位负责人', value: '2' },
    ],
    // 证件类型
    certificateType: [
        { label: '请选择', value: '' },
        { label: '机构信用代码证', value: '1' },
        { label: '民办非企业登记证书', value: '2' },
        { label: '统一社会信用代码证', value: '3' },
        { label: '其他批文或证明', value: '4' },
        { label: '全国组织机构代码证', value: '5' },
        { label: '预先核准通知书', value: '6' },
        { label: '营业执照', value: '7' },
        { label: '事业单位法人证书', value: '8' },
        { label: '政府批文', value: '9' },
        { label: '境外企业证书', value: '10' },
        { label: '社会团体法人登记证书', value: '11' },
        { label: '工会法人资格证书', value: '12' },
        { label: '其他', value: '13' },
        { label: '基金会登记证书', value: '14' },
        { label: '律师事务所执业许可证', value: '15' },
        { label: '司法鉴定许可证', value: '16' },
        { label: '基层法律服务所执业证书', value: '17' },
        { label: '宗教活动登记场所', value: '18' },
        { label: '农村集体经济组织登记证', value: '19' },
    ],
    // 职业
    occupation: [
        { label: '请选择', value: '' },
        { label: '01 - 行政办事人员', value: '01' },
        { label: '03 - 公司员工', value: '03' },
        { label: '04 - 军人警察', value: '04' },
        { label: '05 - 工人', value: '05' },
        { label: '06 - 农、林、牧、渔业生产及辅助人员', value: '06' },
        { label: '07 - 管理人员', value: '07' },
        { label: '08 - 社会生产服务和生活服务人员', value: '08' },
        { label: '09 - 文体明星', value: '09' },
        { label: '11 - 学生', value: '11' },
        { label: '12 - 企事业单位负责人', value: '12' },
        { label: '13 - 金融、财务从业人员', value: '13' },
        { label: '14 - 无业', value: '14' },
        { label: '15 - 离退休人员', value: '15' },
        { label: '17 - 党政机关负责人', value: '17' },
        { label: '18 - 群众团体和社会组织负责人', value: '18' },
        { label: '19 - 教学人员', value: '19' },
        { label: '20 - 科研技术人员', value: '20' },
        { label: '21 - 法律、社会和宗教专业人员', value: '21' },
        { label: '22 - 警察、消防、安保人员', value: '22' },
        { label: '23 - 医护人员', value: '23' },
        { label: '24 - 批发与零售服务人员', value: '24' },
        { label: '25 - 住宿和餐饮服务人员', value: '25' },
        { label: '26 - 信息、软件技术人员', value: '26' },
        { label: '27 - 文化、体育和娱乐服务人员', value: '27' },
        { label: '28 - 交通运输、仓储和邮政业服务人员', value: '28' },
        { label: '29 - 市政公共设施管理服务人员', value: '29' },
        { label: '30 - 房地产服务人员', value: '30' },
        { label: '31 - 军人', value: '31' },
        { label: '32 - 社会保障人员', value: '32' },
    ],
    // 户籍归属
    registeredResidence: [
        { label: '请选择', value: '' },
        { label: '1 - 本省', value: '1' },
        { label: '2 - 外省', value: '2' },
        { label: '3 - 外籍', value: '3' },
        { label: '4 - 其他', value: '4' },
    ],
    // 婚姻状况
    maritalStatus: [
        { label: '请选择', value: '' },
        { label: '1 - 未婚', value: '1' },
        { label: '2 - 已婚', value: '2' },
        { label: '3 - 初婚', value: '3' },
        { label: '4 - 再婚', value: '4' },
        { label: '5 - 复婚', value: '5' },
        { label: '6 - 丧偶', value: '6' },
        { label: '7 - 离婚', value: '7' },
        { label: '8 - 未说明', value: '8' },
    ],
    // 核查结果
    results: [
        { label: '请选择', value: '' },
        { label: '1 - 公民身份证号码与姓名一致，且存在照片', value: '1' },
        { label: '2 - 公民身份号码与姓名一致，但不存在照片', value: '2' },
        { label: '3 - 公民身份号码存在，但与姓名不匹配', value: '3' },
        { label: '4 - 公民身份号码存在，但公民身份号码存在，但证件日期到期', value: '4' },
        { label: '5 - 其他错误', value: '5' },
        { label: '6 - 输入的参数错误', value: '6' },
        { label: '7 - 核查为真实', value: '7' },
        { label: '8 - 待核查', value: '8' },
    ],
    // 性别
    sex: [
        { label: '请选择', value: '' },
        { label: '1 - 男性', value: '1' },
        { label: '2 - 女性', value: '2' },
    ],
    // 现金项目
    cashItems: [
        { label: '请选择', value: '' },
        { label: 'C00 - 其他收入', value: 'C00' },
        { label: 'C01 - 商品销售收入', value: 'C01' },
        { label: 'C02 - 服务业收入', value: 'C02' },
        { label: 'C03 - 城乡个体收入', value: 'C03' },
        { label: 'C04 - 储蓄存款收入', value: 'C04' },
        { label: 'C05 - 其他银行交存现金', value: 'C05' },
    ],
    // 交易类别
    transactionCategory: [
        { label: '请选择', value: '' },
        { label: '1 - 现金', value: '1' },
        { label: '2 - 转账', value: '2' },
        { label: '3 - 现金+转账', value: '3' },
        { label: '4 - 现金待转', value: '4' },
    ],
    // 摘要
    abstract: [
        { label: '请选择', value: '' },
        { label: '0001 - 备用金', value: '0001' },
        { label: '0002 - 工资/奖金', value: '0002' },
        { label: '0003 - 退休金', value: '0003' },
        { label: '0004 - 养老金', value: '0004' },
        { label: '0005 - 公积金', value: '0005' },
        { label: '0006 - 津贴', value: '0006' },
        { label: '0007 - 副食品补贴', value: '0007' },
        { label: '0008 - 酬劳费', value: '0008' },
        { label: '0009 - 劳务费', value: '0009' },
        { label: '0010 - 培训费', value: '0010' },
        { label: '0011 - 差旅费', value: '0011' },
        { label: '0012 - 社保增发', value: '0012' },
        { label: '0013 - 现金存入', value: '0013' },
        { label: '0100 - 自定义', value: '0100' },
        
    ],
    // 存款类别
    depositCategory: [
        { label: '请选择', value: '' },
        { label: 'D001 - 整存整取存款', value: 'D001' },
        { label: 'D002 - 定活两便存款', value: 'D002' },
        { label: 'D003 - 个人通知存款', value: 'D003' },
        { label: 'D004 - 零存争取存款', value: 'D004' },
        { label: 'D005 - 存本取息存款', value: 'D005' },
        { label: 'D007 - 个人大额存单', value: 'D007' },
        { label: 'D008 - 整存零取存款', value: 'D008' },
        { label: 'D009 - 教育储蓄存款', value: 'D009' },
        { label: 'D012 - 心愿存', value: 'D012' },
    ],
    // 产品名称
    productName: [
        { label: '请选择', value: '' },
        { label: '806TD011001 - 一个月整整储蓄存款', value: '806TD011001' },
        { label: '806TD011002 - 三个月整整储蓄存款', value: '806TD011002' },
        { label: '806TD011003 - 六个月整整储蓄存款', value: '806TD011003' },
        { label: '806TD011004 - 一年期整整储蓄存款', value: '806TD011004' },
        { label: '806TD011005 - 二年期整整储蓄存款', value: '806TD011005' },
        { label: '806TD011006 - 三年期整整储蓄存款', value: '806TD011006' },
        { label: '806TD011007 - 五年期整整储蓄存款', value: '806TD011007' },
        { label: '806TD020014 - 二年期大掌柜储蓄存款', value: '806TD020014' },
        { label: '806TD020015 - 三年期大掌柜储蓄存款', value: '806TD020015' },
        { label: '806TD020016 - 五年期大掌柜储蓄存款', value: '806TD020016' },
        { label: '806TD020114 - 二年期大财神储蓄存款', value: '806TD020114' },
        { label: '806TD020115 - 三年期大财神储蓄存款', value: '806TD020115' },
    ],
    // 产品名称
    productName1: [
        { label: '请选择', value: '' },
        { label: '国密金融IC普卡', value: '1' },
        { label: '国密金融IC金卡', value: '2' },
        { label: '国密金融IC白金卡', value: '3' },
    ],
    // 产品名称
    productName2: [
        { label: '请选择', value: '' },
        { label: '806SA190001 - 全国信用证全额保证金', value: '806SA190001' },
        { label: '806SA191001 - 纸质银承全额活期保证金 ', value: '806SA191001' },
        { label: '806SA192001 - 保函全额活期保证金', value: '806SA192001' },
        { label: '806SA193001 - 外汇交易活期保证金', value: '806SA193001' },
        { label: '806SA194001 - 其他活期保证金存款', value: '806SA194001' },
        { label: '806SA195001 - 信用卡保证金', value: '806SA195001' },
        { label: '806SA19A001 - 提货担保全额保证金', value: '806SA19A001' },
        { label: '806SA19B001 - 担保全额保证金', value: '806SA19B001' },
        { label: '806SA19C001 - 全国信用证差额保证金', value: '806SA19C001' },
        { label: '806SA19D001 - 国内信用证全额保证金', value: '806SA19D001' },
        { label: '806SA19E001 - 国内信用证差额保证金', value: '806SA19E001' },
        { label: '806SA19F001 - 保函差额活期保证金', value: '806SA19F001' },
        { label: '806SA19G001 - 商承全额活期保证金', value: '806SA19G001' },
        { label: '806SA19J001 - 纸质银承差额活期保证金', value: '806SA19J001' },
        { label: '806SA19K001 - 商承差额活期保证金', value: '806SA19K001' },
        { label: '806SA19M001 - 电子银承差额活期保证金', value: '806SA19M001' },
        { label: '806SA19N001 - 电子银承全额活期保证金', value: '806SA19N001' },
        { label: '806SA19Y001 - 国际保函活期全额保证金', value: '806SA19Y001' },
        { label: '806SA19Z001 - 国际保函活期差额保证金', value: '806SA19Z001' },
    ],
    // 产品名称
    productName3: [
        { label: '请选择', value: '' },
        { label: '888FSC806060100001 - 公司智能通', value: '8FSC806060100001' },
        { label: '888FSC806060100002 - 一年期对公智能组 ', value: '8FSC806060100002' },
        { label: '888FSC806060100003 - 二年期对公智能组', value: '8FSC806060100003' },
        { label: '888FSC806060100004 - 三年期对公智能组', value: '8FSC806060100004' },
        { label: '888FSC806060100005 - 五年期对公智能组', value: '8FSC806060100005' },
        { label: '888FSC806060100011 - 天舔年盈', value: '888FSC806060100011' },
        { label: '888FSC806060100012 - 二年期季稳年增', value: '888FSC806060100012' },
        { label: '888FSC806060100013 - 三年期季稳年增', value: '888FSC806060100013' },
    ],
    // 产品代码
    productCode: [
        { label: '请选择', value: '' },
        { label: '806SA115001 - 费用专户存款', value: '806SA115001' },
        { label: '806SA123001 - 工业企业活期存款', value: '806SA123001' },
        { label: '806SA125001 - 社会团体活期存款', value: '806SA125001' },
        { label: '806SA126001 - 农业企业活期存款', value: '806SA126001' },
        { label: '806SA127001 - 服务业企业活期存款', value: '806SA127001' },
        { label: '806SA131001 - 建筑业企业活期存款', value: '806SA131001' },
        { label: '806SA133001 - 公共企业活期存款', value: '806SA133001' },
        { label: '806SA135001 - 私营及个体活期存款', value: '806SA135001' },
        { label: '806SA141001 - 房地产企业活期存款', value: '806SA141001' },
        { label: '806SA142001 - 商业企业活期存款', value: '806SA142001' },
        { label: '806SA148001 - 其他单位活期存款', value: '806SA148001' },
        { label: '806SA149001 - 小额贷款公司活期存款', value: '806SA149001' },
        { label: '806SA150001 - 行政事业活期存款', value: '806SA150001' },
        { label: '806SA155001 - 住房公积金活期存款', value: '806SA155001' },
        { label: '806SA158001 - 社保基金活期存款', value: '806SA158001' },
    ],
    // 利率类型
    rateType: [
        { label: '请选择', value: '' },
        { label: '00 - 议价利率', value: '00' },
        { label: '01 - 挂牌利率', value: '01' },
        { label: '02 - 浮动利率', value: '02' },
    ],
    // 账号生成方式
    generationMethod: [
        { label: '请选择', value: '' },
        { label: '0 - 自动生成', value: '0' },
        { label: '1 - 手工选号', value: '1' },
    ],
    // 产品类别
    productType: [
        { label: '请选择', value: '' },
        { label: 'A101 - 单位活期存款', value: 'A101' },
        { label: 'A102 - 单位活期保证金存款', value: 'A101' },
        { label: 'A103 - 单位定期保证金存款', value: 'A101' },
    ],
    // 特殊账户标识
    specialAccount: [
        { label: '请选择', value: '' },
        { label: '00 - 无', value: '00' },
        { label: '01 - 特殊账户', value: '01' },
        { label: '02 - 管理类账户', value: '02' },
        { label: 'A1 - 金融机构清算交收账户', value: 'A1' },
        { label: 'A4 - 保险公司资本保障金账户', value: 'A4' },
    ],
    // 销户原因
    cancelReason: [
        { label: '请选择', value: '' },
        { label: '1 - 转户', value: '1' },
        { label: '2 - 撤开', value: '2' },
        { label: '3 - 解散', value: '3' },
        { label: '4 - 宣告破产', value: '4' },
        { label: '5 - 关闭', value: '5' },
        { label: '6 - 被吊销营业执照或执业许可证', value: '6' },
        { label: '7 - 其他', value: '7' },
    ],
    // 账户性质（对公）
    accountNature: [
        { label: 'U600 - 人民币保证金账户', value: 'U600' },
    ],
    // 账户性质(个人)
    accountNature1: [
        { label: 'P100 - 个人结算户', value: 'P100' },
    ],
    // 账户性质（单位活期开户）
    accountNature: [
        { label: 'U100 - 人民币基本存款账户', value: 'U100' },
    ],
    // 账户性质(单位活期销户、单位活期存入)
    accountNature2: [
        { label: '请选择', value: '' },
        { label: '人民币基本存款账户', value: '1' },
        { label: '人民币一般存款账户', value: '2' },
        { label: '人民币临时存款账户', value: '3' },
        { label: '人民币专用存款账户', value: '4' },
    ],
    // 取现标志
    withdrawalMark: [
        { label: '请选择', value: '' },
        { label: 'Y - 可取现', value: 'Y' },
        { label: 'N - 不可取现', value: 'N' },
    ],
    // 企业属性
    enterpriseAttribute: [
        { label: '请选择', value: '' },
        { label: '01 - 银行自身', value: '01' },
        { label: '02 - 金融机构', value: '02' },
        { label: '03 - 中资机构', value: '03' },
        { label: '04 - 外资机构', value: '04' },
    ],
    // 币种/币别
    currency: [
        { label: '请选择', value: '' },
        { label: '01 - 人民币', value: '01' },
        { label: '12 - 英镑', value: '12' },
        { label: '13 - 港元', value: '13' },
        { label: '14 - 美元', value: '14' },
        { label: '27 - 日元', value: '27' },
        { label: '33 - 欧元', value: '33' },
        { label: '91 - 韩元', value: '91' },
    ],
    // 经营场所核实
    businessPremises: [
        { label: '请选择', value: '' },
        { label: '1 - 核实通过', value: '1' },
        { label: '2 - 核实未通过', value: '2' },
        { label: '3 - 无需核实', value: '3' },
    ],
    // 税收居民标志
    taxResidentSign: [
        { label: '请选择', value: '' },
        { label: '01 - 仅为中国税收居民', value: '01' },
        { label: '02 - 仅为非居民', value: '02' },
        { label: '03 - 既是中国税收居民又是其他国家(地区)税收居民', value: '03' },
        { label: '04 - 不需开展调查', value: '04' },
    ],
    // 国民经济部门
    nationalSector: [
        { label: '请选择', value: '' },
        { label: 'A01 - 中央政府', value: 'A01' },
        { label: 'A02 - 地方政府', value: 'A02' },
        { label: 'A03 - 社会保障基金', value: 'A03' },
        { label: 'B01 - 货币型号', value: 'B01' },
        { label: 'B02 - 监管型号', value: 'B02' },
        { label: 'B03 - 银行业存款类金融机构', value: 'B03' },
        { label: 'B04 - 银行业非存款类金融机构', value: 'B04' },
        { label: 'B05 - 证券业务金融机构', value: 'B05' },
        { label: 'B06 - 保险业务金融机构', value: 'B06' },
        { label: 'B07 - 交易及结算类金融机构', value: 'B07' },
        { label: 'B08 - 金融控股公司', value: 'B08' },
        { label: 'B09 - 特殊目的载体', value: 'B09' }, 
        { label: 'B10 - 公司企业', value: 'B10' },
        { label: 'B99 - 其他', value: 'B99' },
    ],
    // 钞汇
    remittance: [
        { label: '请选择', value: '' },
        { label: '0 - 现钞', value: '0' },
        { label: '1 - 现汇', value: '1' },
    ],
    // 是否取得自证声明
    selfCertification: [
        { label: '请选择', value: '' },
        { label: '1 - 是', value: '1' },
        { label: '2 - 否', value: '2' },
    ],
    // 本/异地开户
    accountOpening: [
        { label: '请选择', value: '' },
        { label: '1 - 本地', value: '1' },
        { label: '2 - 异地', value: '2' },
    ],
    // 利率依据
    rateBasis: [
        { label: '请选择', value: '' },
        { label: '01 - 挂牌利率', value: '01' },
        { label: '02 - 议价利率', value: '02' },
    ],
    // 直接解冻
    directThawing: [
        { label: '请选择', value: '' },
        { label: '1 - 否', value: '1' },
        { label: '2 - 是', value: '2' },
    ],
    // 是否签约消费联动
    isLinkage: [
        { label: '请选择', value: '' },
        { label: '1 - 否', value: '1' },
        { label: '2 - 是', value: '2' },
    ],
    // 账户等级
    accountGrade: [
        { label: '请选择', value: '' },
        { label: '01 - Ⅰ类户', value: '01' },
        { label: '02 - Ⅱ类户', value: '02' },
    ],
    // 凭证种类
    voucherType: [
        { label: '请选择', value: '' },
        { label: '0101 - 小额银行本票', value: '0101' },
        { label: '0106 - 同城银行本票', value: '0106' },
        { label: '0205 - 城商汇票', value: '0205' },
        { label: '0260 - 支付密码器', value: '0260' },
        { label: '0299 - 旧存折', value: '0299' },
        { label: '0301 - 清分机支票', value: '0301' },
        { label: '0302 - 转账支票', value: '0302' },
        { label: '0303 - 现金支票', value: '0303' },
        { label: '0399 - 旧零整', value: '0399' },
        { label: '0401 - 银行承兑汇票', value: '0401' },
        { label: '0402 - 商业承兑汇票', value: '0402' },
        { label: '0499 - 旧存单', value: '0499' },
    ],
    // 账户类型（对公）
    accountType: [
        { label: '请选择', value: '' },
        { label: '国密金融IC普卡', value: '1' },
        { label: '国密金融IC金卡', value: '2' },
        { label: '国密金融IC白金卡', value: '3' },
    ],
    // 账户类型（个人）
    accountType1: [
        { label: '1 - 信用(公务)卡', value: '1' },
    ],
    // 账户类型（单位活期销户、单位活期存入）
    accountType2: [
        { label: '单位结算账户', value: '1' },
    ],
    // 账户类型（开户校验）
    accountType3: [
        { label: '请选择', value: '' },
        { label: '基本存款账户', value: '1' },
        { label: '一般存款账户', value: '2' },
        { label: '预算单位专用存款账户', value: '3' },
        { label: '非预算单位专用存款账户', value: '4' },
        { label: '特殊单位专用存款账户', value: '5' },
        { label: '临时机构临时存款账户', value: '6' },
        { label: '非临时机构临时户存款户', value: '7' },
        { label: '临时机构验资账户', value: '8' },
    ],
    // 变更方式
    changeMode: [
        { label: '请选择', value: '' },
        { label: '1 - 交回变更', value: '1' },
        { label: '2 - 未交回变更', value: '2' },
    ],
    // Ukey类型
    UkeyType: [
        { label: '请选择', value: '' },
        { label: '5010 - 海泰方圆蓝牙', value: '5010' },
        { label: '5011 - 握奇国密', value: '5011' },
        { label: '5001 - 海泰方圆一代', value: '5001' },
        { label: '5012 - 握奇蓝牙', value: '5012' },
        { label: '5002 - 飞天诚信二代', value: '5002' },
        { label: '5003 - 天诚盛业二代', value: '5003' },
        { label: '5004 - 坚石诚信二代', value: '5004' },
        { label: '5005 - 坚石诚信一代', value: '5005' },
        { label: '5006 - 飞天诚信国密', value: '5006' },
        { label: '5007 - 坚石诚信国密', value: '5007' },
        { label: '5008 - 坚石诚信蓝牙', value: '5008' },
        { label: '5009 - 海泰国密', value: '5009' },
    ],
    // 发行/注册标志
    issueMark: [
        { label: '请选择', value: '' },
        { label: '0 - 发行', value: '0' },
        { label: '1 - 注册', value: '1' },
    ],
    // 计息标志
    interestMark: [
        { label: 'Y - 计息', value: 'Y' },
        { label: 'N - 不计息', value: 'N' },
    ],
    // 收费类型
    chargeType: [
        { label: '请选择', value: '' },
        { label: '3 - 免费', value: '3' },
    ],
    // 卡片类型
    cardType: [
        { label: '5 - 磁条芯片复合IC卡', value: '5' },
    ],
    // 卡片种类
    cardKind: [
        { label: '请选择', value: '' },
        { label: '国密IC卡普通卡', value: '1' },
        { label: '国密IC卡金卡', value: '2' },
        { label: '国密IC卡白金卡', value: '3' },
    ],
    // 卡片种类(信用卡激活)
    cardKind1: [
        { label: '请选择', value: '' },
        { label: '长安银行标准信用卡（普卡）', value: '1' },
        { label: '长安银行标准信用卡（金卡）', value: '2' },
        { label: '长安银行白金信用卡', value: '3' },
    ],
    // 国籍
    nationality: [
        { label: '请选择', value: '' },
        { label: '0156 - 中华人民共和国', value: '0156' },
        { label: '0124 - 加拿大', value: '0124' },
        { label: '0136 - 开曼群岛', value: '0136' },
        { label: '0152 - 智利共和国', value: '0152' },
        { label: '0158 - 中国台湾', value: '0158' },
        { label: '0392 - 日本国', value: '0392' },
        { label: '0398 - 哈萨克斯坦共和国', value: '0398' },
        { label: '0408 - 朝鲜', value: '0408' },
        { label: '0410 - 大韩民国', value: '0410' },
        { label: '0826 - 英国', value: '0826' },
        { label: '0840 - 美利坚合众国', value: '0840' },
        { label: '0446 - 中国澳门特别行政区', value: '0446' },
        { label: '0344 - 中国香港特别行政区', value: '0344' },
    ],
    // 建立渠道
    creationChannels: [
        { label: '01 - 柜面', value: '01' },
    ],
    // 核实状态
    verifyStatus: [
        { label: '1 - 柜面核实', value: '1' },
    ],
    // 号码状态
    codeStatus: [
        { label: '请选择', value: '' },
        { label: '6 - 实名验证', value: '6' },
    ],
    // 最高学历
    highestEducation: [
        { label: '请选择', value: '' },
        { label: '10 - 研究生教育', value: '10' },
        { label: '20 - 大学本科', value: '20' },
        { label: '30 - 专科教育', value: '30' },
        { label: '40 - 中等职业教育', value: '40' },
        { label: '60 - 普通高级中学教学', value: '60' },
        { label: '70 - 初级中学教学', value: '70' },
        { label: '80 - 小学教育', value: '80' },
        { label: '90 - 其他', value: '90' },
    ],
    // 最高学位
    highestDegree: [
        { label: '请选择', value: '' },
        { label: '0 - 其他', value: '0' },
        { label: '1 - 名誉博士', value: '1' },
        { label: '2 - 博士', value: '2' },
        { label: '3 - 硕士', value: '3' },
        { label: '4 - 学士', value: '4' },
        { label: '9 - 未知', value: '9' },
    ],
    // 单位性质
    unitNature: [
        { label: '请选择', value: '' },
        { label: '01 - 具备独立法人资格的企业', value: '01' },
        { label: '02 - 其他经济组织', value: '02' },
        { label: '03 - 法人企业分支机构', value: '03' },
        { label: '04 - 事业单位', value: '04' },
        { label: '05 - 其他', value: '05' },
    ],
    // 住宅类型
    residentialType: [
        { label: '请选择', value: '' },
        { label: '1 - 自置', value: '1' },
        { label: '2 - 公积金贷款', value: '2' },
        { label: '3 - 商业贷款', value: '3' },
        { label: '4 - 租用', value: '4' },
        { label: '5 - 其他', value: '5' },
    ],
    // 月收入(元)
    monthlyIncome: [
        { label: '请选择', value: '' },
        { label: '1 - 1500以下', value: '1' },
        { label: '2 - 1500到2000', value: '2' },
        { label: '3 - 2000到3000', value: '3' },
        { label: '4 - 3000到5000', value: '4' },
        { label: '5 - 5000到8000', value: '5' },
        { label: '6 - 8000到10000', value: '6' },
        { label: '7 - 10000到30000', value: '7' },
        { label: '8 - 30000以上', value: '8' },
    ],
    // 机构名称
    organName: [
        { label: '806010001 - 长安银行营业部', value: '806010001' },
    ],
    // 客户类别
    customerType: [
        { label: '请选择', value: '' },
        { label: '公司客户', value: '1' },
        { label: '机构客户', value: '2' },
    ],
    // 手机号码核查结果
    mobileResults: [
        { label: '验证一致', value: '1' },
    ],
    // 法人身份核查结果
    personResults: [
        { label: '00 - 公民身份号码与姓名一致，且存在照片', value: '00' },
    ],
    // 联系人身份核查结果
    contactResults: [
        { label: '00 - 公民身份号码与姓名一致，且存在照片', value: '00' },
    ],
    // 卡片异常状态
    abnormalStatus: [
        { label: 'A - 卡片未激活', value: 'A' },
    ],
    // 授权方式
    authMethod: [
        { label: '请选择', value: '' },
        { label: '01 - 本地授权', value: '01' },
    ],
    // 授权方式
    identityResults: [
        { label: '请选择', value: '' },
        { label: '1 - 通过', value: '1' },
        { label: '2 - 不通过', value: '2' },
    ],
    // 申请渠道
    applicationChannel: [
        { label: '04 - 面对面进件', value: '04' },
    ],
    // 机构类别
    organizationCategory: [
        { label: '请选择', value: '' },
        { label: '1 - 其他非金融机构', value: '1' },
        { label: '0 - 消极非金融机构', value: '0' },
    ],
    // 经办人标志
    operatorLogo: [
        { label: '01 - 没有经办人', value: '01' },
        { label: '02 - 有经办人', value: '02' },
    ],
    // 自选账号
    optionalModel: [
        { label: '请选择', value: '' },
        { label: '非自选账号', value: '1' },
        { label: '自选账号', value: '2' },
    ],
    // 币别类型
    currencyType: [
        { label: '请选择', value: '' },
        { label: '01 - 单币种', value: '01' },
        { label: '02 - 多币种', value: '02' },
    ],
    // 审批类型
    approvalType: [
        { label: '请选择', value: '' },
        { label: '1 - 核准类', value: '1' },
        { label: '2 - 备案类', value: '2' },
        { label: '9 - 其他', value: '9' },
    ],
    // 证件合一标志
    personMark: [
        { label: '请选择', value: '' },
        { label: '1 - 单位法定代表人', value: '1' },
        { label: '2 - 单位负责人', value: '2' },
    ],
    // 法人/单位负责人标志
    oneSignMark: [
        { label: '请选择', value: '' },
        { label: '01 - 已合一', value: '01' },
        { label: '02 -  一照多码', value: '02' },
        { label: '03 - 未合一', value: '03' },
    ],
    // 所属系统
    system: [
        { label: '请选择', value: '' },
        { label: '000001 - 政府机构', value: '000001' },
        { label: '000002 - 事业单位', value: '000002' },
        { label: '000003 - 军队武警', value: '000003' },
        { label: '000004 - 社会团体', value: '000004' },
        { label: '000005 - 银行金融机构', value: '000005' },
        { label: '000006 - 非银行金融机构', value: '000006' },
        { label: '000007 - 其他机构客户', value: '000007' },
        { label: '000008 - 学校', value: '000008' },
        { label: '000009 - 医院', value: '000009' },
        { label: '000010 - 科研院所', value: '000010' },
        { label: '000014 - 其他公司客户', value: '000014' },
    ],
    // 行业类别
    industryCategory: [
        { label: '请选择', value: '' },
        { label: 'A01 - 农业', value: 'A01' },
        { label: 'A02 - 林业', value: 'A02' },
        { label: 'A03 - 畜牧业', value: 'A03' },
        { label: 'A04 - 渔业', value: 'A04' },
        { label: 'A05 - 农、林、牧、渔、服务业', value: 'A05' },
        { label: 'A06 - 制造业', value: 'A06' },
        { label: 'B06 - 煤炭开采和洗选业', value: 'B06' },
        { label: 'B07 - 石油和天然气开采业', value: 'B07' },
        { label: 'B08 - 黑色金属采选业', value: 'B08' },
        { label: 'B09 - 有色金属采选业', value: 'B09' },
        { label: 'B10 - 非金属采选业', value: 'B10' },
        { label: 'B11 - 开采辅助活动', value: 'B11' },
        { label: 'B12 - 其他采矿业', value: 'B12' },
        { label: 'C13 - 农副食品加工业', value: 'C13' },
        { label: 'C14 - 食品制造业', value: 'C14' },
        { label: 'C15 - 酒,饮料和制茶制造业', value: 'C15' },
        { label: 'C16 - 烟草制品业', value: 'C16' },
        { label: 'C17 - 纺织业', value: 'C17' },
        { label: 'C18 - 中国共产党机关', value: 'S90' },
        { label: 'R85 - 新闻出版业', value: 'R85' },
        { label: 'R86 - 广播电视影视业', value: 'R86' },
        { label: 'R87 - 文化艺术业', value: 'R87' },
        { label: 'R88 - 体育', value: 'R88' },
        { label: 'R89 - 娱乐业', value: 'R89' },
        { label: 'S90 - 中国共产党机关', value: 'S90' },
        { label: 'S91 - 国家机关', value: 'S91' },
        { label: 'S92 - 人民政协', value: 'S92' },
        { label: 'S93 - 民主党派', value: 'S93' },
        { label: 'S94 - 群众团队、社会团体和其他成员组织', value: 'S94' },
        { label: 'S95 - 其他组织', value: 'S95' },
    ],
    // 存款人类别
    depositType: [
        { label: '请选择', value: '' },
        { label: '01 - 企业法人', value: '01' },
        { label: '02 - 非企业法人', value: '02' },
        { label: '03 - 机关', value: '03' },
        { label: '04 - 实行预算管理的事业单位', value: '04' },
        { label: '05 - 非预算管理的事业单位', value: '05' },
        { label: '06 - 团级（含）以上军队及分散执勤的支队', value: '06' },
        { label: '07 - 团级（含）以上武警部队及分散执勤的支队', value: '07' },
        { label: '08 - 社会团体', value: '08' },
        { label: '09 - 宗教租住', value: '09' },
        { label: '10 - 民办非企业组织', value: '10' },
        { label: '11 - 外地常设机构', value: '11' },
        { label: '12 - 外国驻华机构', value: '12' },
        { label: '13 - 境外机构', value: '13' },
        { label: '14 - 有字号的个体工商户', value: '14' },
        { label: '15 - 无字号的个体工商户', value: '15' },
        { label: '16 - 居民委员会、村民委员会、社区委员会', value: '16' },
        { label: '17 - 单位设立的独立核算附属机构', value: '17' },
        { label: '18 - QFII', value: '18' },
        { label: '19 - 跨境清算', value: '19' },
        { label: '20 - 临时机构', value: '20' },
        { label: '21 - 境外贸易机构', value: '21' },
        { label: '22 - 其他组织', value: '22' },
    ],
    // 公司客户类别名称
    accountName: [
        { label: '请选择', value: '' },
        { label: '1 - 政府融资平台客户', value: '1' },
        { label: '2 - 私立医院', value: '2' },
        { label: '3 - 私立学校', value: '3' },
        { label: '4 - 集团客户辖属财务公司', value: '4' },
        { label: '5 - 大中型担保公司', value: '5' },
        { label: '6 - 科研院所', value: '6' },
        { label: '7 - 代理政策性银行结算业务', value: '7' },
        { label: '8 - 其他公司客户', value: '8' },
    ],
    // 印鉴卡状态
    sealCardStatus: [
        { label: '正常', value: '1' },
    ],
    // 签约状态
    signingStatus: [
        { label: '请选择', value: '' },
        { label: '1 - 签约', value: '1' },
        { label: 'N - 未签约', value: 'N' },
    ],
    // 通存范围
    storageRange: [
        { label: '6 - 通存', value: '6' },
        { label: '7 - 不通存', value: '7' },
    ],
    // 通兑范围
    exchange: [
        { label: '7 - 通兑', value: '7' },
        { label: '8 - 不通兑', value: '8' },
    ],
    // 转存标志
    redepositFlag: [
        { label: '请选择', value: '' },
        { label: '0 - 不自动转存', value: '0' },
        { label: '1 - 本+息转存', value: '1' },
        { label: '2 - 本金转存', value: '2' },
    ],
    // 通存通兑标志
    universalMark: [
        { label: '请选择', value: '' },
        { label: '0 - 不通存通兑', value: '0' },
        { label: '1 - 通存通兑', value: '1' },
    ],
    // 特殊账户类别
    specialAccountType: [
        { label: '请选择', value: '' },
        { label: '01 - 资金监管账户', value: '01' },
        { label: '02 - 预算单位零余额账户', value: '02' },
        { label: '12 - 农民工工资专用账户', value: '12' },
        { label: '14 - 农民工工资专户兼资金监管账户', value: '14' },
    ],
    // 支取方式
    withdrawalMethod: [
        { label: '请选择', value: '' },
        { label: '0000 - 无', value: '0000' },
        { label: '1000 - 凭单（折）', value: '1000' },
        { label: '1001 - 凭单（折）密', value: '1001' },
        { label: '1100 - 凭单（折）证', value: '1100' },
        { label: '1101 - 凭单（折）证密', value: '1101' },
    ],
    // 支取方式(单位活期开户)
    withdrawalMethod1: [
        { label: '0010 - 凭印鉴', value: '0010' },
    ],
    post: [
        { label: '01 - 法人代表/负责人', value: '01' },
        { label: '02 - 财务负责人', value: '02' },
        { label: '03 - 会计主管', value: '03' },
        { label: '04 - 会计经办', value: '04' },
        { label: '05 - 出纳', value: '05' },
        { label: '06 - 总经理', value: '06' },
        { label: '07 - 行政岗/非财务人员', value: '07' },
        { label: '08 - 财务联系人', value: '08' },
        { label: '99 - 其他', value: '其他' },
    ],
    huoqiProductName: [
        { label: '请选择', value: '' },
        { label: '888FSC806060100001-公司智能通', value: '888FSC806060100001' },
        { label: '888FSC508060100011-天添年盈', value: '888FSC508060100011' },
        { label: '888FSC508060100012-二年期季稳年增', value: '888FSC508060100012' },
        { label: '888FSC508060100013-三年期季稳年增', value: '888FSC508060100013' },
        { label: '888FSC508060100014-五年期季稳年增', value: '888FSC508060100014' },
        { label: '888FSC508060100015-国际信用证活期全季一年', value: '888FSC508060100015' },
        { label: '888FSC508060100016-国际信用证活期全季二年', value: '888FSC508060100016' },
        { label: '888FSC508060100017-国际信用证活期全季三年', value: '888FSC508060100017' },
        { label: '888FSC508060100018-纸质银行承汇票一年期', value: '888FSC508060100018' },
        { label: '888FSC508060100019-纸质银行承汇票二年期', value: '888FSC508060100019' },
        { label: '888FSC508060100020-纸质银行承汇票三年期', value: '888FSC508060100020' },
        { label: '888FSC508060100021-保函全额活期保证金A', value: '888FSC508060100021' },
        { label: '888FSC508060100022-保函全额活期保证金B', value: '888FSC508060100022' },
        { label: '888FSC508060100023-保函全额活期保证金C', value: '888FSC508060100023' },
        { label: '888FSC508060100024-国内信用证活期产品A', value: '888FSC508060100024' },
        { label: '888FSC508060100025-国内信用证活期产品B', value: '888FSC508060100025' },
        { label: '888FSC508060100026-国内信用证活期产品C', value: '888FSC508060100026' },
        { label: '888FSC508060100027-国际信用证活期产品', value: '888FSC508060100027' },
        { label: '888FSC508060100028-纸质银行承兑汇票', value: '888FSC508060100028' },
        { label: '888FSC508060100029-保函全额活期保证金', value: '888FSC508060100029' },
        { label: '888FSC508060100030-国内信用证活期全能型', value: '888FSC508060100030' },
        { label: '888FSC508060100031-电子银行承兑汇票A', value: '888FSC508060100031' },
        { label: '888FSC508060100032-电子银行承兑汇票B', value: '888FSC508060100032' },
        { label: '888FSC508060100033-电子银行承兑汇票C', value: '888FSC508060100033' },
    ],
    gerenProductName: [
        { label: '请选择', value: '' },
        { label: '888FSC806050100001-长长聚', value: '888FSC806050100001' },
        { label: '888FSC806050100001-长长富', value: '888FSC806050100001' },
        { label: '888FSC806050100001-存贷通', value: '888FSC806050100001' },
    ],
    nation: [
        { label: '0001-壮族', value: '0001' },
        { label: '0002-藏族', value: '0002' },
        { label: '0003-裕固族', value: '0003' },
        { label: '0004-彝族', value: '0004' },
        { label: '0005-瑶族', value: '0005' },
        { label: '0006-锡伯族', value: '0006' },
        { label: '0007-乌孜别克族', value: '0007' },
        { label: '0008-维吾尔族', value: '0008' },
        { label: '0009-阿昌族', value: '0009' },
        { label: '0010-佤族', value: '0010' },
        { label: '0011-土家族', value: '0011' },
        { label: '0012-土族', value: '0012' },
        { label: '0013-塔塔尔族', value: '0013' },
        { label: '0014-塔吉克族', value: '0014' },
        { label: '0015-水族', value: '0015' },
        { label: '0016-畲族', value: '0016' },
        { label: '0017-撒拉族', value: '0017' },
        { label: '0018-羌族', value: '0018' },
        { label: '0019-普米族', value: '0019' },
        { label: '0020-怒族', value: '0020' },
        { label: '0021-纳西族', value: '0021' },
        { label: '0022-仫佬族', value: '0022' },
        { label: '0023-苗族', value: '0023' },
        { label: '0024-蒙古族', value: '0024' },
        { label: '0025-门巴族', value: '0025' },
        { label: '0026-毛南族', value: '0026' },
        { label: '0027-满族', value: '0027' },
        { label: '0028-珞巴族', value: '0028' },
        { label: '0029-僳僳族', value: '0029' },
        { label: '0030-黎族', value: '0030' },
        { label: '0031-拉祜族', value: '0031' },
        { label: '0032-柯尔克孜族', value: '0032' },
        { label: '0033-景颇族', value: '0033' },
        { label: '0034-京族', value: '0034' },
        { label: '0035-基诺族', value: '0035' },
        { label: '0036-回族', value: '0036' },
        { label: '0037-赫哲族', value: '0037' },
        { label: '0038-哈萨克族', value: '0038' },
        { label: '0039-哈尼族', value: '0039' },
        { label: '0040-仡佬族', value: '0040' },
        { label: '0041-高山族', value: '0041' },
        { label: '0042-鄂温克族', value: '0042' },
        { label: '0043-俄罗斯族', value: '0043' },
        { label: '0044-鄂伦春族', value: '0044' },
        { label: '0045-独龙族', value: '0045' },
        { label: '0046-东乡族', value: '0046' },
        { label: '0047-侗族', value: '0047' },
        { label: '0048-德昂族', value: '0048' },
        { label: '0049-傣族', value: '0049' },
        { label: '0050-达斡尔族', value: '0050' },
        { label: '0051-朝鲜族', value: '0051' },
        { label: '0052-布依族', value: '0052' },
        { label: '0053-保安族', value: '0053' },
        { label: '0054-布朗族', value: '0054' },
        { label: '0055-白族', value: '0055' },
        { label: '0056-汉族', value: '0056' },
    ]
};

function setOptions(ids){
    for (let h = 0; h < ids.length; h++) {
        var optionArr = [], items = options[ids[h]];
        if(ids[h]=='oldUkeyType' || ids[h]=='newUkeyType'){
            items = options['UkeyType'];
        }
        if (ids[h] == 'currency' || ids[h] == 'registeredCapital' || ids[h] == 'currency2' || ids[h] == 'currency3' || ids[h] == 'currency4'){
            items = options['currency'];
        }
        if (ids[h] == 'remittance2' || ids[h] == 'remittance3' || ids[h] == 'remittance4') {
            items = options['remittance']
        }
        if (ids[h] == 'abstract' || ids[h] == 'abstract1' || ids[h] == 'abstract2' || ids[h] == 'abstract3'){
            items = options['abstract'];
        }
        if(ids[h]=='cashItems' || ids[h]=='cashItems1'){
            items = options['cashItems'];
        }
        if(ids[h]=='codeStatus' || ids[h]=='codeStatus1'){
            items = options['codeStatus'];
        }
        if(ids[h]=='transactionCategory' || ids[h]=='transactionCategory1'){
            items = options['transactionCategory'];
        }
        if(ids[h]=='nationality' || ids[h]=='residence' || ids[h]=='registrationCountry' || ids[h]=='hostCountry'){
            items = options['nationality'];
        }
        if(ids[h]=='certificateType' || ids[h]=='mainType' || ids[h]=='accountCertificateType'){
            items = options['certificateType'];
        }
        if(ids[h]=='certificateKind' || ids[h]=='certificateKind1' || ids[h]=='spouseCertificate' || ids[h]=='idType' || ids[h]=='auxiliaryCard1' || ids[h]=='personCertificateType'){
            items = options['certificateKind'];
        }
        if (items != undefined) {
            for (let i = 0; i < items.length; i++) {
                optionArr.push('<option value=' + items[i].value + '>' + items[i].label + '</option>');
            }
            $("#sle_" + ids[h]).append(optionArr);
        }
    }
}