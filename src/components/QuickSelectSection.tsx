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
    <section className="py-16 md:py-24 bg-card">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Быстрый подбор</h2>
          <p className="mt-3 text-muted-foreground">
            Ответьте на 3 вопроса — мы подберём оптимальный комплект
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border bg-background p-6 md:p-8 shadow-sm space-y-5">
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
