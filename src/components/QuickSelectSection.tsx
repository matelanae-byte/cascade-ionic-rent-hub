import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const QuickSelectSection = () => {
  const [task, setTask] = useState("");
  const [height, setHeight] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Подбор: ${task}, ${height}, ${city}`);
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">Подбор</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Быстрый подбор</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Ответьте на 3 вопроса — мы подберём оптимальный комплект
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-[0_2px_24px_-12px_hsl(var(--primary)/0.15)] space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Тип задачи</label>
              <Select value={task} onValueChange={setTask}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facade">Мойка фасадов</SelectItem>
                  <SelectItem value="windows">Мойка окон</SelectItem>
                  <SelectItem value="glass">Мойка витрин</SelectItem>
                  <SelectItem value="construction">Послестрой. уборка</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Высота объекта</label>
              <Select value={height} onValueChange={setHeight}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">До 5 м</SelectItem>
                  <SelectItem value="10">До 10 м</SelectItem>
                  <SelectItem value="15">До 15 м</SelectItem>
                  <SelectItem value="20">До 20 м</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Город</label>
              <Input placeholder="Ваш город" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto gap-2 font-semibold">
            Подобрать оборудование <ArrowRight size={16} />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default QuickSelectSection;
