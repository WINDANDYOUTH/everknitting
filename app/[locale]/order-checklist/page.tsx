export default function PrintableOrderChecklistPage() {
  const sections = [
    {
      title: "一、Day 1｜订单启动 / 物料确认",
      items: [
        "核算订单所需毛料用量",
        "联系毛行准备毛料",
        "确认毛料颜色、批次、品质",
        "检查吊牌、主唛、洗水唛",
        "检查件袋、中包袋、箱子数量",
        "核对吓数资料（老刘）",
        "确认是否有电绣 / 打扣 / 车花边",
        "确认尺寸、针数、工艺说明无误",
      ],
    },
    {
      title: "二、Day 2–7｜电脑织机",
      items: [
        "毛料已交电脑织机",
        "确认电脑机排单时间",
        "交代严格按吓数资料生产",
        "交代尺寸不可私自更改",
        "交代控制下栏数量",
        "交代不可弄脏、不可油污",
        "加急单每日跟进排机",
        "下机数量、尺寸、外观抽检 OK",
      ],
    },
    {
      title: "三、缝盘｜电绣前结构处理",
      items: [
        "前幅、后幅、袖片等部件已核对",
        "缝盘师傅已收到正确工艺要求",
        "若后续需要电绣，已明确告知：不可埋夹 / 不可把影响电绣的位置先缝死",
        "缝盘线迹检查 OK",
        "尺寸复查 OK",
      ],
    },
    {
      title: "四、洗水｜电绣前必须完成",
      items: [
        "洗水已完成",
        "洗水后无缩水异常",
        "洗水后无变形、色差异常",
        "洗水后尺寸复查 OK",
      ],
    },
    {
      title: "五、电绣｜如订单需要",
      items: [
        "电绣资料、位置、颜色已确认",
        "电绣周期已确认：3–5天，最快3天",
        "确认缝盘未埋夹，电绣位置可操作",
        "电绣完成后位置准确",
        "无跳线、断线、错位、污渍",
        "电绣后外观检查 OK",
      ],
    },
    {
      title: "六、打扣子 / 车花边｜如订单需要",
      items: [
        "扣子款式、颜色、数量正确",
        "扣位准确、牢固",
        "花边 / 布料辅料款式正确",
        "车花边位置准确、线迹整齐",
      ],
    },
    {
      title: "七、后整初查 / 车唛 / 烫衣 / 打包",
      items: [
        "后整初查：数量、尺寸、外观 OK",
        "剪线头、清洁处理完成",
        "主唛、洗水唛位置正确",
        "车唛线迹整齐、方向无误",
        "烫衣完成，版型平整",
        "吊牌已挂，件袋 / 中包袋完成",
        "装箱数量正确，外箱检查 OK",
        "物流安排完成，发货信息已更新",
      ],
      note: true,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          .print-page {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            padding: 9mm !important;
          }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print mb-4 text-center text-sm text-slate-600">
        打印提示：Ctrl/Cmd + P → A4 → 缩放选择“适合页面”。
      </div>

      <section className="print-page mx-auto min-h-[297mm] w-[210mm] bg-white p-[10mm] text-slate-900 shadow-xl">
        <header className="mb-2 border-b-2 border-slate-900 pb-1.5 text-center">
          <h1 className="text-[21px] font-bold tracking-wide">客户订单执行 Checklist</h1>
          <p className="mt-0.5 text-[11px] text-slate-600">
            标准周期：30天｜从客户付款时间开始计算
          </p>
        </header>

        <section className="mb-2 grid grid-cols-4 gap-1.5 text-[10.5px]">
          <InfoBox label="订单编号" />
          <InfoBox label="客户名称" />
          <InfoBox label="付款日期" />
          <InfoBox label="计划交期" />
          <InfoBox label="负责人" />
          <InfoBox label="是否加急" value="□ 是　□ 否" />
          <InfoBox label="是否电绣" value="□ 是　□ 否" />
          <InfoBox label="特殊工艺" value="□ 打扣　□ 车花边" />
        </section>

        <div className="mb-2 border border-slate-900 bg-slate-50 px-2 py-1.5 text-[11px] font-bold leading-snug">
          关键顺序：电脑织机 → 缝盘 → 洗水 → 电绣 → 打扣子 / 车花边 → 后整初查 → 车唛 → 烫衣 → 打包。若电绣要求缝盘不可埋夹，必须提前告知缝盘师傅。
        </div>

        <div className="space-y-1.5">
          {sections.map((section) => (
            <ChecklistSection key={section.title} {...section} />
          ))}
        </div>

        <footer className="mt-1.5 grid grid-cols-3 gap-1.5 text-[10.5px]">
          <InfoBox label="跟单签名" />
          <InfoBox label="QC签名" />
          <InfoBox label="完成日期" />
        </footer>
      </section>
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-h-[25px] border border-slate-300 px-1.5 py-1">
      <span className="text-slate-500">{label}：</span>
      {value ? <span>{value}</span> : null}
    </div>
  );
}

function ChecklistSection({
  title,
  items,
  note,
}: {
  title: string;
  items: string[];
  note?: boolean;
}) {
  return (
    <section className="break-inside-avoid border border-slate-200">
      <div className="bg-slate-900 px-2 py-1 text-[12px] font-bold text-white">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-x-1.5 px-2 py-1.5">
        {items.map((item) => (
          <label
            key={item}
            className={`flex min-h-[19px] items-start gap-1.5 py-0.5 text-[10.5px] leading-tight ${
              item.length > 34 ? "col-span-2" : ""
            }`}
          >
            <span className="mt-[1px] h-[11px] w-[11px] shrink-0 border border-slate-900" />
            <span>{item}</span>
          </label>
        ))}
      </div>
      {note ? (
        <div className="mx-2 border-t border-dashed border-slate-300 py-1.5 text-[10.5px] text-slate-700">
          异常备注：
        </div>
      ) : null}
    </section>
  );
}
