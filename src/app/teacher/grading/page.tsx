import { Empty } from "../_components/empty";
import { PageHeader } from "../_components/page-header";

export default function GradingPage() {
  return (
    <>
      <PageHeader title="ตรวจงาน" desc="งานที่นักเรียนส่งมาและรอตรวจ" />
      <Empty icon="check" title="ยังไม่มีงานรอตรวจ" desc="งานที่นักเรียนส่งมาจะแสดงที่นี่" />
    </>
  );
}
