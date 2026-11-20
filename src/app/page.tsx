import { Button, Card } from "@heroui/react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Score Student Project</Card.Title>
          <Card.Description>Next.js + HeroUI v3 พร้อมใช้งานแล้ว</Card.Description>
        </Card.Header>
        <Card.Footer className="flex gap-2">
          <Button variant="primary">เริ่มต้น</Button>
          <Button variant="secondary">ดูเพิ่มเติม</Button>
        </Card.Footer>
      </Card>
    </main>
  );
}
