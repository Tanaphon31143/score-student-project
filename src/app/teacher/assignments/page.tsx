import { Empty } from "../_components/empty";
import { PageHeader } from "../_components/page-header";

export default function AssignmentsPage() {
  return (
    <>
      <PageHeader title="งานที่มอบหมาย" desc="งานทั้งหมดที่มอบหมายให้นักเรียน" />
      <Empty icon="clipboard" title="ยังไม่มีงานที่มอบหมาย" desc="เมื่อสร้างห้องเรียนแล้ว จะมอบหมายงานได้ที่นี่" />
    </>
  );
}
